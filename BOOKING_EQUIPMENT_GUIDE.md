# คู่มือการใช้งาน Booking Equipment API

## ภาพรวมระบบ

ระบบการจองรถมีการเชื่อมโยงระหว่าง **Booking** และ **Equipment** ผ่านตาราง `booking_equipments` ซึ่งเป็น Many-to-Many relationship

### โครงสร้างฐานข้อมูล

```
bookings (การจอง)
├── booking_id (PK)
├── user_id
├── vehicle_id
├── start_date
├── end_date
└── ... (ข้อมูลการจองอื่นๆ)

equipments (อุปกรณ์)
├── equipment_id (PK)
├── equipment_name
├── description
└── created_at

booking_equipments (ตารางเชื่อม)
├── booking_equipment_id (PK)
├── booking_id (FK → bookings)
├── equipment_id (FK → equipments)
├── quantity (จำนวน)
└── created_at
```

## ความสัมพันธ์ระหว่าง Booking และ Equipment

1. **หนึ่งการจอง** สามารถมี **หลายอุปกรณ์** ได้
2. **หนึ่งอุปกรณ์** สามารถใช้ใน **หลายการจอง** ได้
3. แต่ละการเชื่อมโยงจะมี **จำนวน (quantity)** ของอุปกรณ์นั้นๆ

## API Endpoints

### 1. ดึงรายการอุปกรณ์ในการจอง
```http
GET /api/bookings/{booking_id}/equipments
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
  "data": [
    {
      "booking_equipment_id": "uuid",
      "booking_id": "booking_uuid",
      "equipment_id": "equipment_uuid",
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

### 2. เพิ่มอุปกรณ์ให้การจอง
```http
POST /api/bookings/{booking_id}/equipments
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "equipment_id": "a1e1f3c1c2d14f6aa7b5407f0410d1a1",
  "quantity": 2
}
```

**Response:**
```json
{
  "message": "เพิ่มอุปกรณ์เรียบร้อย",
  "equipment_id": "a1e1f3c1c2d14f6aa7b5407f0410d1a1",
  "quantity": 2
}
```

### 3. อัปเดตจำนวนอุปกรณ์
```http
PUT /api/bookings/{booking_id}/equipments/{equipment_id}
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "quantity": 3
}
```

### 4. ลบอุปกรณ์ออกจากการจอง
```http
DELETE /api/bookings/{booking_id}/equipments/{equipment_id}
Authorization: Bearer {jwt_token}
```

## วิธีการทดสอบ API

### ขั้นตอนที่ 1: เข้าสู่ระบบ
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### ขั้นตอนที่ 2: ดึงรายการการจอง
```bash
curl -X GET http://localhost:3000/api/bookings \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### ขั้นตอนที่ 3: ดูอุปกรณ์ในการจอง
```bash
curl -X GET http://localhost:3000/api/bookings/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/equipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### ขั้นตอนที่ 4: เพิ่มอุปกรณ์
```bash
curl -X POST http://localhost:3000/api/bookings/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa/equipments \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "equipment_id": "a1e1f3c1c2d14f6aa7b5407f0410d1a1",
    "quantity": 2
  }'
```

## อุปกรณ์ที่มีในระบบ

จากฐานข้อมูล มีอุปกรณ์ดังนี้:

| Equipment ID | ชื่ออุปกรณ์ | คำอธิบาย |
|-------------|------------|----------|
| a1e1f3c1c2d14f6aa7b5407f0410d1a1 | วิทยุสื่อสาร | ใช้สื่อสารระหว่างรถ |
| b2f2e4d2d3e24f7bb8c6518f1521e2b2 | GPS Navigator | นำทางด้วยระบบดาวเทียม |
| c3g3g5e3e4f34g8cc9d7629g2632f3c3 | กล้องติดรถยนต์ | บันทึกภาพขณะขับขี่ |
| d4h4h6f4f5g45h9dd0e8730h3743g4d4 | ไฟฉาย | อุปกรณ์ให้แสงสว่าง |
| e5i5i7g5g6h56i0ee1f9841i4854h5e5 | ชุดปฐมพยาบาล | อุปกรณ์สำหรับดูแลผู้บาดเจ็บเบื้องต้น |

## ข้อจำกัดปัจจุบัน

1. **ไม่มี Equipment API แยกต่างหาก**: ปัจจุบันยังไม่มี `/api/equipments` endpoint เพื่อดูรายการอุปกรณ์ทั้งหมด
2. **การสร้าง Booking ไม่รวม Equipment**: เมื่อสร้างการจองใหม่ จะต้องเพิ่มอุปกรณ์แยกต่างหาก
3. **ไม่มีการตรวจสอบ Stock**: ระบบไม่ได้ตรวจสอบว่าอุปกรณ์มีเพียงพอหรือไม่

## ข้อเสนอแนะสำหรับการพัฒนา

1. **สร้าง Equipment Controller**: เพื่อจัดการอุปกรณ์โดยตรง
2. **เพิ่ม Equipment ใน Booking Creation**: ให้สามารถเลือกอุปกรณ์ตอนสร้างการจองได้
3. **Stock Management**: เพิ่มระบบจัดการสต็อกอุปกรณ์
4. **Equipment Validation**: ตรวจสอบว่า equipment_id ที่ส่งมามีอยู่จริงในระบบ

## ตัวอย่างการใช้งานใน Frontend

```javascript
// เพิ่มอุปกรณ์ให้การจอง
async function addEquipmentToBooking(bookingId, equipmentId, quantity) {
  const response = await fetch(`/api/bookings/${bookingId}/equipments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      equipment_id: equipmentId,
      quantity: quantity
    })
  });
  
  return response.json();
}

// ดึงรายการอุปกรณ์ในการจอง
async function getBookingEquipments(bookingId) {
  const response = await fetch(`/api/bookings/${bookingId}/equipments`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  return response.json();
}
```
