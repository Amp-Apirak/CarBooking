// models/bookingEquipmentModel.js
// ฟังก์ชันติดต่อฐานข้อมูลสำหรับตาราง booking_equipments

const db = require('../config/db');

// นำเข้าไลบรารี uuid เพื่อสร้าง uuid ใหม่เมื่อมีการเพิ่มข้อมูลใหม่
// นำเข้า uuidv4 จากไลบรารี uuid เพื่อสร้าง uuid ใหม่เมื่อมีการเพิ่มข้อมูลใหม่
const { v4: uuidv4 } = require('uuid');


/** ดึงรายการ booking_equipments พร้อม pagination */
async function getBookingsPaged(limit, offset) {
  const [rows] = await db.query(
    `SELECT * FROM booking_equipments ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM booking_equipments`
  );
  return { rows, total };
}

/** ดึงรายการ booking_equipments ตาม id ทั้งคู่ */
async function getById(bookingId, equipmentId) {
  const [rows] = await db.query(
    `SELECT * FROM booking_equipments WHERE booking_id = ? AND equipment_id = ?`,
    [bookingId, equipmentId]
  );
  return rows[0];
}

/** เพิ่มอุปกรณ์ให้ booking */
async function addEquipment(bookingId, equipmentId, quantity = 1) {
  const booking_equipment_id = uuidv4().replace(/-/g, ''); // สร้าง uuid ใหม่เพื่อใช้ในการเพิ่มข้อมูลใหม่
  await db.query(
    `INSERT INTO booking_equipments (booking_equipment_id, booking_id, equipment_id, quantity) VALUES (?, ?, ?, ?)`,
    [booking_equipment_id, bookingId, equipmentId, quantity]
  );
}

/** แก้ไขจำนวนอุปกรณ์ */
async function updateEquipment(bookingId, equipmentId, quantity) {
  await db.query(
    `UPDATE booking_equipments SET quantity = ?
     WHERE booking_id = ? AND equipment_id = ?`,
    [quantity, bookingId, equipmentId]
  );
}

/** ลบอุปกรณ์ออกจาก booking */
async function removeEquipment(bookingId, equipmentId) {
  await db.query(
    `DELETE FROM booking_equipments
     WHERE booking_id = ? AND equipment_id = ?`,
    [bookingId, equipmentId]
  );
}

/** นับจำนวนทั้งหมด */
async function countAll() {
  const [[{ count }]] = await db.query(`SELECT COUNT(*) AS count FROM booking_equipments`);
  return count;
}

module.exports = {
  getBookingsPaged,
  getById,
  addEquipment,
  updateEquipment,
  removeEquipment
};