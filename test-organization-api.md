# การทดสอบ Organization Hierarchy API

## ภาพรวมระบบ

ระบบ Organization ใหม่รองรับ:
- **Hierarchy Structure**: องค์กรแม่-ลูก แบบไม่จำกัดระดับ
- **Path-based Access**: ใช้ path สำหรับการค้นหาและจัดการ hierarchy
- **Permission Management**: ควบคุมการเข้าถึงข้อมูลตามองค์กร
- **Cross-Organization Access**: Admin สามารถให้สิทธิ์เข้าถึงองค์กรอื่นได้

## โครงสร้างฐานข้อมูล

```sql
organizations:
- organization_id (PK)
- parent_id (FK → organizations.organization_id)
- path (varchar) - เช่น "root/dept1/subdept1"
- name
- created_at

user_allowed_orgs:
- id (PK)
- user_id (FK → users.user_id)
- organization_id (FK → organizations.organization_id)
- granted_by (FK → users.user_id)
- created_at
```

## การทดสอบ API

### ขั้นตอนที่ 1: เข้าสู่ระบบ

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### ขั้นตอนที่ 2: ดูรายการองค์กรทั้งหมด

```bash
curl -X GET http://localhost:3000/api/organizations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### ขั้นตอนที่ 3: สร้างองค์กรหลัก (Root Organization)

```bash
curl -X POST http://localhost:3000/api/organizations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "บริษัท ABC จำกัด"
  }'
```

**Expected Response:**
```json
{
  "organization_id": "generated_uuid_here"
}
```

### ขั้นตอนที่ 4: สร้างองค์กรลูก (Sub Organization)

```bash
curl -X POST http://localhost:3000/api/organizations \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ฝ่ายบุคคล",
    "parent_id": "PARENT_ORG_ID_HERE"
  }'
```

### ขั้นตอนที่ 5: ดูองค์กรลูกทั้งหมด

```bash
curl -X GET http://localhost:3000/api/organizations/PARENT_ORG_ID/children \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### ขั้นตอนที่ 6: ดูโครงสร้างองค์กรแบบ Hierarchy

```bash
curl -X GET http://localhost:3000/api/organizations/ROOT_ORG_ID/hierarchy \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**
```json
[
  {
    "organization_id": "root_id",
    "parent_id": null,
    "path": "root_id",
    "name": "บริษัท ABC จำกัด",
    "created_at": "2025-06-28T10:00:00.000Z"
  },
  {
    "organization_id": "child_id",
    "parent_id": "root_id",
    "path": "root_id/child_id",
    "name": "ฝ่ายบุคคล",
    "created_at": "2025-06-28T10:01:00.000Z"
  }
]
```

### ขั้นตอนที่ 7: ดูองค์กรที่ผู้ใช้เข้าถึงได้

```bash
curl -X GET http://localhost:3000/api/organizations/accessible \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### ขั้นตอนที่ 8: ให้สิทธิ์ผู้ใช้เข้าถึงองค์กรอื่น

```bash
curl -X POST http://localhost:3000/api/organizations/TARGET_ORG_ID/grant-access \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "TARGET_USER_ID"
  }'
```

### ขั้นตอนที่ 9: ยกเลิกสิทธิ์การเข้าถึง

```bash
curl -X DELETE http://localhost:3000/api/organizations/TARGET_ORG_ID/revoke-access \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "TARGET_USER_ID"
  }'
```

### ขั้นตอนที่ 10: แก้ไของค์กร (ย้ายไปอยู่ใต้ parent ใหม่)

```bash
curl -X PUT http://localhost:3000/api/organizations/ORG_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ฝ่ายบุคคลใหม่",
    "parent_id": "NEW_PARENT_ID"
  }'
```

## ตัวอย่างการใช้งาน Hierarchy

### สร้างโครงสร้างองค์กร

```
บริษัท ABC จำกัด (root)
├── ฝ่ายบุคคล
│   ├── แผนกสรรหา
│   └── แผนกพัฒนาบุคลากร
├── ฝ่ายเทคโนโลยี
│   ├── แผนกพัฒนาระบบ
│   └── แผนกโครงสร้างพื้นฐาน
└── ฝ่ายการเงิน
    ├── แผนกบัญชี
    └── แผนกงบประมาณ
```

### Path Examples

- บริษัท ABC: `abc123`
- ฝ่ายบุคคล: `abc123/hr456`
- แผนกสรรหา: `abc123/hr456/recruit789`

## การใช้งานใน Application

### 1. Data Filtering by Organization

```javascript
// ดึงข้อมูล bookings เฉพาะองค์กรที่ user เข้าถึงได้
async function getUserBookings(user_id) {
  const accessibleOrgs = await getUserAccessibleOrganizations(user_id);
  const orgIds = accessibleOrgs.map(org => org.organization_id);
  
  // Filter bookings by organization
  const bookings = await getBookingsByOrganizations(orgIds);
  return bookings;
}
```

### 2. Hierarchy-based Reporting

```javascript
// รายงานสำหรับ manager ที่ต้องการดูข้อมูลทั้งแผนก
async function getDepartmentReport(organization_id) {
  const hierarchy = await getOrganizationHierarchy(organization_id);
  const allOrgIds = hierarchy.map(org => org.organization_id);
  
  // รวมข้อมูลจากทุกองค์กรในสายงาน
  const report = await generateReportForOrganizations(allOrgIds);
  return report;
}
```

## การแก้ไขปัญหา

### ปัญหา: ไม่สามารถเข้าถึงข้อมูลได้
1. ตรวจสอบว่า user อยู่ในองค์กรที่ถูกต้อง
2. ตรวจสอบว่ามีสิทธิ์เข้าถึงองค์กรเป้าหมายหรือไม่
3. ใช้ API `/organizations/accessible` เพื่อดูองค์กรที่เข้าถึงได้

### ปัญหา: Path ไม่ถูกต้อง
1. ตรวจสอบ parent_id ว่าถูกต้อง
2. ระบบจะอัปเดต path อัตโนมัติเมื่อย้ายองค์กร

### ปัญหา: ไม่สามารถลบองค์กรได้
1. ตรวจสอบว่ามีองค์กรลูกหรือไม่
2. ตรวจสอบว่ามี users ที่อยู่ในองค์กรนี้หรือไม่
