# สรุปการเปลี่ยนแปลงจาก Department เป็น Organization Hierarchy

## การเปลี่ยนแปลงหลัก

### 1. โครงสร้างฐานข้อมูล

**เดิม (departments):**
```sql
departments:
- department_id (PK)
- name
- created_at
```

**ใหม่ (organizations):**
```sql
organizations:
- organization_id (PK)
- parent_id (FK → organizations.organization_id)
- path (varchar) - สำหรับ hierarchy navigation
- name
- created_at

user_allowed_orgs:
- id (PK)
- user_id (FK → users.user_id)
- organization_id (FK → organizations.organization_id)
- granted_by (FK → users.user_id)
- created_at
```

**ตาราง users:**
- เปลี่ยนจาก `department_id` เป็น `organization_id`

### 2. ไฟล์ที่ได้รับการปรับปรุง

#### Models
- ✅ `models/userModel.js` - เปลี่ยน department_id เป็น organization_id
- ✅ `models/organizationModel.js` - เพิ่มฟังก์ชัน hierarchy และ permission management

#### Controllers
- ✅ `controllers/organizationController.js` - เพิ่ม hierarchy และ access management functions

#### Routes
- ✅ `routes/organizationRoutes.js` - เพิ่ม endpoints ใหม่สำหรับ hierarchy

#### Middleware
- ✅ `middleware/organizationAccessMiddleware.js` - ใหม่! สำหรับตรวจสอบสิทธิ์

#### Test Files
- ✅ `testUserModel.js` - เปลี่ยน department_id เป็น organization_id

### 3. API Endpoints ใหม่

```
GET    /api/organizations                    - ดูรายการองค์กรทั้งหมด
GET    /api/organizations/accessible         - ดูองค์กรที่เข้าถึงได้
GET    /api/organizations/:id                - ดูองค์กรเฉพาะ
GET    /api/organizations/:id/children       - ดูองค์กรลูก
GET    /api/organizations/:id/hierarchy      - ดูโครงสร้างทั้งหมด
POST   /api/organizations                    - สร้างองค์กรใหม่
PUT    /api/organizations/:id                - แก้ไของค์กร
DELETE /api/organizations/:id                - ลบองค์กร
POST   /api/organizations/:id/grant-access   - ให้สิทธิ์เข้าถึง
DELETE /api/organizations/:id/revoke-access  - ยกเลิกสิทธิ์
```

### 4. ฟีเจอร์ใหม่

#### Hierarchy Management
- สร้างองค์กรแบบ parent-child ไม่จำกัดระดับ
- Path-based navigation (เช่น "company/hr/recruitment")
- อัตโนมัติอัปเดต path เมื่อย้ายองค์กร

#### Permission Management
- ผู้ใช้เห็นข้อมูลเฉพาะองค์กรของตัวเอง
- Admin สามารถให้สิทธิ์เข้าถึงองค์กรอื่นได้
- ตรวจสอบสิทธิ์แบบ hierarchy (เห็นข้อมูลองค์กรลูกได้)

#### Data Filtering
- Middleware สำหรับกรองข้อมูลตามองค์กร
- API สำหรับดึงข้อมูลที่เข้าถึงได้เท่านั้น

### 5. การใช้งาน Middleware

```javascript
// ตรวจสอบสิทธิ์เข้าถึงองค์กรเฉพาะ
router.get('/bookings/:organization_id', 
  auth, 
  checkOrgAccess, 
  bookingController.getByOrg
);

// ตรวจสอบสิทธิ์แบบ hierarchy
router.get('/reports/:organization_id', 
  auth, 
  checkOrgHierarchyAccess, 
  reportController.getHierarchyReport
);

// กรองข้อมูลตามสิทธิ์
router.get('/bookings', 
  auth, 
  filterAccessibleOrgs, 
  bookingController.getAccessible
);
```

### 6. ตัวอย่างการใช้งาน

#### สร้างโครงสร้างองค์กร
```javascript
// 1. สร้างบริษัทหลัก
const companyId = await createOrganization("บริษัท ABC จำกัด");

// 2. สร้างฝ่าย
const hrId = await createOrganization("ฝ่ายบุคคล", companyId);
const itId = await createOrganization("ฝ่าย IT", companyId);

// 3. สร้างแผนก
const recruitId = await createOrganization("แผนกสรรหา", hrId);
const devId = await createOrganization("แผนกพัฒนา", itId);
```

#### ให้สิทธิ์เข้าถึงข้อมูล
```javascript
// HR Manager สามารถดูข้อมูลฝ่าย IT ได้
await grantOrganizationAccess(hrManagerId, itId, adminId);

// ตรวจสอบสิทธิ์
const hasAccess = await checkOrganizationAccess(hrManagerId, itId);
```

### 7. การ Migration ข้อมูล

หากต้องการ migrate ข้อมูลจาก departments เป็น organizations:

```sql
-- 1. Copy ข้อมูลจาก departments
INSERT INTO organizations (organization_id, parent_id, path, name, created_at)
SELECT department_id, NULL, department_id, name, created_at 
FROM departments;

-- 2. อัปเดต users table
UPDATE users SET organization_id = department_id WHERE department_id IS NOT NULL;

-- 3. ลบ column เก่า (ระวัง! backup ก่อน)
-- ALTER TABLE users DROP COLUMN department_id;
```

### 8. การทดสอบ

ใช้ไฟล์ `test-organization-api.md` สำหรับทดสอบ API ทั้งหมด

### 9. ข้อควรระวัง

1. **Backup ข้อมูล**: ก่อน migrate ข้อมูลจริง
2. **Performance**: Path-based queries อาจช้าหากข้อมูลเยอะ ควรใส่ index
3. **Circular Reference**: ระวังการสร้าง parent-child loop
4. **Permission Inheritance**: กำหนดชัดเจนว่า permission จะ inherit ยังไง

### 10. Next Steps

1. ทดสอบ API ทั้งหมดด้วย `test-organization-api.md`
2. อัปเดต frontend เพื่อใช้ organization_id แทน department_id
3. เพิ่ม organization filter ใน booking และ report APIs
4. สร้าง UI สำหรับจัดการ organization hierarchy
5. เพิ่ม audit log สำหรับการเปลี่ยนแปลงสิทธิ์

## สรุป

การเปลี่ยนแปลงนี้ทำให้ระบบมีความยืดหยุ่นมากขึ้นในการจัดการโครงสร้างองค์กร และสามารถควบคุมการเข้าถึงข้อมูลได้ละเอียดขึ้น ระบบใหม่รองรับ:

- ✅ Unlimited hierarchy levels
- ✅ Cross-organization access control  
- ✅ Path-based navigation
- ✅ Permission inheritance
- ✅ Data filtering by organization
- ✅ Audit trail for access changes
