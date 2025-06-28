# คู่มือทดสอบ API แบบ Step-by-Step

## ข้อมูลเบื้องต้น

**Base URL:** `http://localhost:3000/api`

**ข้อมูลสำหรับทดสอบ:**
- Username: `admin`
- Password: `admin123`
- Booking ID ตัวอย่าง: `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
- Equipment ID ตัวอย่าง: `a1e1f3c1c2d14f6aa7b5407f0410d1a1` (วิทยุสื่อสาร)

---

## Step 1: เข้าสู่ระบบเพื่อรับ JWT Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

**Expected Response:**
```json
{
  "message": "เข้าสู่ระบบสำเร็จ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "user_id": "...",
    "username": "admin",
    "role": "..."
  }
}
```

**📝 บันทึก Token:** คัดลอก token จาก response มาใช้ในขั้นตอนต่อไป

---

## Step 2: ดูรายการอุปกรณ์ทั้งหมดในระบบ

```bash
curl -X GET http://localhost:3000/api/equipments/all \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "data": [
    {
      "equipment_id": "a1e1f3c1c2d14f6aa7b5407f0410d1a1",
      "equipment_name": "วิทยุสื่อสาร",
      "description": "ใช้สื่อสารระหว่างรถ",
      "created_at": "2025-06-22T06:56:24.000Z"
    },
    {
      "equipment_id": "b2f2e4d2d3e24f7bb8c6518f1521e2b2",
      "equipment_name": "GPS Navigator",
      "description": "นำทางด้วยระบบดาวเทียม",
      "created_at": "2025-06-22T06:56:24.000Z"
    }
  ],
  "total": 10
}
```

---

## Step 3: ดูรายการการจองทั้งหมด

```bash
curl -X GET http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "data": [
    {
      "booking_id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "user_id": "...",
      "vehicle_id": "...",
      "start_date": "2025-07-10",
      "end_date": "2025-07-10",
      "status": "pending"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

**📝 เลือก Booking ID:** ใช้ booking_id จาก response สำหรับขั้นตอนต่อไป

---

## Step 4: ดูอุปกรณ์ที่มีในการจองปัจจุบัน

```bash
curl -X GET http://localhost:3000/api/bookings/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/equipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response (ถ้ายังไม่มีอุปกรณ์):**
```json
{
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

---

## Step 5: เพิ่มอุปกรณ์ให้กับการจอง

```bash
curl -X POST http://localhost:3000/api/bookings/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/equipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "equipment_id": "a1e1f3c1c2d14f6aa7b5407f0410d1a1",
    "quantity": 2
  }'
```

**Expected Response:**
```json
{
  "message": "เพิ่มอุปกรณ์เรียบร้อย",
  "equipment_id": "a1e1f3c1c2d14f6aa7b5407f0410d1a1",
  "quantity": 2
}
```

---

## Step 6: ตรวจสอบอุปกรณ์ที่เพิ่มแล้ว

```bash
curl -X GET http://localhost:3000/api/bookings/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/equipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "data": [
    {
      "booking_equipment_id": "generated_uuid_here",
      "booking_id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      "equipment_id": "a1e1f3c1c2d14f6aa7b5407f0410d1a1",
      "quantity": 2,
      "created_at": "2025-06-28T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

---

## Step 7: อัปเดตจำนวนอุปกรณ์

```bash
curl -X PUT http://localhost:3000/api/bookings/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/equipments/a1e1f3c1c2d14f6aa7b5407f0410d1a1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 3
  }'
```

**Expected Response:**
```json
{
  "message": "อัปเดตจำนวนเรียบร้อย"
}
```

---

## Step 8: ดูข้อมูลอุปกรณ์เฉพาะในการจอง

```bash
curl -X GET http://localhost:3000/api/bookings/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/equipments/a1e1f3c1c2d14f6aa7b5407f0410d1a1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "booking_equipment_id": "generated_uuid_here",
  "booking_id": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  "equipment_id": "a1e1f3c1c2d14f6aa7b5407f0410d1a1",
  "quantity": 3,
  "created_at": "2025-06-28T10:00:00.000Z"
}
```

---

## Step 9: ลบอุปกรณ์ออกจากการจอง

```bash
curl -X DELETE http://localhost:3000/api/bookings/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/equipments/a1e1f3c1c2d14f6aa7b5407f0410d1a1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "message": "ลบอุปกรณ์เรียบร้อย"
}
```

---

## Step 10: ตรวจสอบว่าอุปกรณ์ถูกลบแล้ว

```bash
curl -X GET http://localhost:3000/api/bookings/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/equipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

**Expected Response:**
```json
{
  "data": [],
  "pagination": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 0
  }
}
```

---

## เพิ่มเติม: API อุปกรณ์อื่นๆ

### ค้นหาอุปกรณ์
```bash
curl -X GET "http://localhost:3000/api/equipments?search=GPS" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

### ดูอุปกรณ์ที่เชื่อมโยงกับการจองเฉพาะ (แบบ JOIN)
```bash
curl -X GET http://localhost:3000/api/equipments/booking/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

---

## การแก้ไขปัญหาที่อาจเกิดขึ้น

### 1. Error 401 Unauthorized
- ตรวจสอบว่า JWT Token ถูกต้องและยังไม่หมดอายุ
- ลองเข้าสู่ระบบใหม่เพื่อรับ Token ใหม่

### 2. Error 404 Not Found
- ตรวจสอบ booking_id และ equipment_id ว่าถูกต้อง
- ใช้ API ดูรายการเพื่อหา ID ที่ถูกต้อง

### 3. Error 500 Internal Server Error
- ตรวจสอบ server logs
- ตรวจสอบการเชื่อมต่อฐานข้อมูล

### 4. Equipment ID ไม่ถูกต้อง
- ใช้ `GET /api/equipments/all` เพื่อดู equipment_id ที่ถูกต้อง
