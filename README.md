# CarBooking

POST /api/ad/change-password

{
  "username": "ad_user",
  "oldPassword": "เก่า",
  "newPassword": "ใหม่"
}

ผลลัพธ์: { "message": "เปลี่ยนรหัสผ่าน AD สำเร็จ" }

กรณี error: 401 ถ้ารหัสเดิมผิด, 500 ถ้าเปลี่ยนไม่สำเร็จ