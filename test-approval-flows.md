# การทดสอบ Approval Flows API

## ขั้นตอนที่ 1: เข้าสู่ระบบ

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**บันทึก JWT Token จาก response**

## ขั้นตอนที่ 2: สร้าง Approval Flow ใหม่

```bash
curl -X POST http://localhost:3000/api/approval-flows \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "flow_name": "อนุมัติทั่วไป",
    "flow_description": "ใช้สำหรับงานทั่วไป"
  }'
```

**Expected Response:**
```json
{
  "message": "สร้าง Flow สำเร็จ",
  "flow_id": "generated_uuid_here"
}
```

## ขั้นตอนที่ 3: ดูรายการ Approval Flows ทั้งหมด

```bash
curl -X GET http://localhost:3000/api/approval-flows \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
[
  {
    "flow_id": "generated_uuid_here",
    "flow_name": "อนุมัติทั่วไป",
    "flow_description": "ใช้สำหรับงานทั่วไป",
    "is_active": true,
    "created_at": "2025-06-28T10:00:00.000Z"
  }
]
```

## ขั้นตอนที่ 4: ดู Approval Flow เฉพาะ

```bash
curl -X GET http://localhost:3000/api/approval-flows/FLOW_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## ขั้นตอนที่ 5: ปิดการใช้งาน Flow

```bash
curl -X PUT http://localhost:3000/api/approval-flows/FLOW_ID_HERE/deactivate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## ขั้นตอนที่ 6: เปิดการใช้งาน Flow

```bash
curl -X PUT http://localhost:3000/api/approval-flows/FLOW_ID_HERE/activate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## ขั้นตอนที่ 7: ลบ Flow

```bash
curl -X DELETE http://localhost:3000/api/approval-flows/FLOW_ID_HERE \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## การแก้ไขปัญหา

### ปัญหา: 500 Internal Server Error
- ตรวจสอบ server logs
- ตรวจสอบการเชื่อมต่อฐานข้อมูล
- ตรวจสอบว่าตาราง `approval_flows` มีอยู่ในฐานข้อมูล

### ปัญหา: 401 Unauthorized
- ตรวจสอบ JWT Token ว่าถูกต้องและยังไม่หมดอายุ
- ลองเข้าสู่ระบบใหม่

### ปัญหา: 400 Bad Request
- ตรวจสอบ JSON format ใน request body
- ตรวจสอบว่าส่ง `flow_name` และ `flow_description` ครบถ้วน
