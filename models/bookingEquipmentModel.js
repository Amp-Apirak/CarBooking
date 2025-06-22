const db = require('../config/db');

/** ดึงอุปกรณ์ทั้งหมดของ booking */
async function listByBooking(bookingId) {
  const [rows] = await db.query(
    `SELECT be.equipment_id, eq.equipment_name, be.quantity
     FROM booking_equipments AS be
     JOIN equipments AS eq ON be.equipment_id = eq.equipment_id
     WHERE be.booking_id = ?`,
    [bookingId]
  );
  return rows;
}

/** ดึงรายการ booking_equipments ทั้งหมด แบบ paged */
async function getPaged(page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  const [rows] = await db.query(
    `SELECT * FROM booking_equipments ORDER BY booking_id DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  return rows;
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
  await db.query(
    `INSERT INTO booking_equipments (booking_id, equipment_id, quantity)
     VALUES (?, ?, ?)
     ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
    [bookingId, equipmentId, quantity, quantity]
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
  listByBooking,
  getPaged,
  getById,
  addEquipment,
  updateEquipment,
  removeEquipment,
  countAll
};