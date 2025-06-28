// models/equipmentModel.js
// ฟังก์ชันติดต่อฐานข้อมูลสำหรับตาราง equipments

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * ดึงรายการอุปกรณ์ทั้งหมดพร้อม pagination
 */
async function getEquipmentsPaged(limit, offset) {
  const [rows] = await db.query(
    `SELECT * FROM equipments ORDER BY equipment_name ASC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM equipments`
  );
  return { rows, total };
}

/**
 * ดึงรายการอุปกรณ์ทั้งหมด (ไม่มี pagination)
 */
async function getAllEquipments() {
  const [rows] = await db.query(
    `SELECT * FROM equipments ORDER BY equipment_name ASC`
  );
  return rows;
}

/**
 * ดึงข้อมูลอุปกรณ์ตาม ID
 */
async function getEquipmentById(equipmentId) {
  const [rows] = await db.query(
    `SELECT * FROM equipments WHERE equipment_id = ? LIMIT 1`,
    [equipmentId]
  );
  return rows[0] || null;
}

/**
 * สร้างอุปกรณ์ใหม่
 */
async function createEquipment(data) {
  const id = uuidv4().replace(/-/g, '');
  const sql = `
    INSERT INTO equipments (equipment_id, equipment_name, description)
    VALUES (?, ?, ?)
  `;
  const params = [
    id,
    data.equipment_name,
    data.description
  ];
  await db.query(sql, params);
  return id;
}

/**
 * แก้ไขข้อมูลอุปกรณ์
 */
async function updateEquipment(equipmentId, data) {
  const fields = [];
  const params = [];
  
  if (data.equipment_name !== undefined) {
    fields.push('equipment_name = ?');
    params.push(data.equipment_name);
  }
  
  if (data.description !== undefined) {
    fields.push('description = ?');
    params.push(data.description);
  }
  
  if (fields.length === 0) return;
  
  const sql = `UPDATE equipments SET ${fields.join(', ')} WHERE equipment_id = ?`;
  params.push(equipmentId);
  await db.query(sql, params);
}

/**
 * ลบอุปกรณ์
 */
async function deleteEquipment(equipmentId) {
  // ตรวจสอบว่ามีการใช้งานอุปกรณ์นี้ในการจองหรือไม่
  const [bookingEquipments] = await db.query(
    `SELECT COUNT(*) as count FROM booking_equipments WHERE equipment_id = ?`,
    [equipmentId]
  );
  
  if (bookingEquipments[0].count > 0) {
    throw new Error('ไม่สามารถลบอุปกรณ์ได้ เนื่องจากมีการใช้งานในการจอง');
  }
  
  // ตรวจสอบว่ามีการเชื่อมโยงกับรถหรือไม่
  const [vehicleEquipments] = await db.query(
    `SELECT COUNT(*) as count FROM vehicle_equipments WHERE equipment_id = ?`,
    [equipmentId]
  );
  
  if (vehicleEquipments[0].count > 0) {
    throw new Error('ไม่สามารถลบอุปกรณ์ได้ เนื่องจากมีการเชื่อมโยงกับรถ');
  }
  
  const sql = `DELETE FROM equipments WHERE equipment_id = ?`;
  await db.query(sql, [equipmentId]);
}

/**
 * ค้นหาอุปกรณ์ตามชื่อ
 */
async function searchEquipments(searchTerm, limit, offset) {
  const [rows] = await db.query(
    `SELECT * FROM equipments 
     WHERE equipment_name LIKE ? OR description LIKE ?
     ORDER BY equipment_name ASC 
     LIMIT ? OFFSET ?`,
    [`%${searchTerm}%`, `%${searchTerm}%`, limit, offset]
  );
  
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM equipments 
     WHERE equipment_name LIKE ? OR description LIKE ?`,
    [`%${searchTerm}%`, `%${searchTerm}%`]
  );
  
  return { rows, total };
}

/**
 * ดึงอุปกรณ์ที่ใช้ในการจองเฉพาะ
 */
async function getEquipmentsByBooking(bookingId) {
  const [rows] = await db.query(
    `SELECT e.*, be.quantity, be.created_at as added_at
     FROM equipments e
     INNER JOIN booking_equipments be ON e.equipment_id = be.equipment_id
     WHERE be.booking_id = ?
     ORDER BY e.equipment_name ASC`,
    [bookingId]
  );
  return rows;
}

/**
 * ดึงอุปกรณ์ที่เชื่อมโยงกับรถเฉพาะ
 */
async function getEquipmentsByVehicle(vehicleId) {
  const [rows] = await db.query(
    `SELECT e.*, ve.created_at as added_at
     FROM equipments e
     INNER JOIN vehicle_equipments ve ON e.equipment_id = ve.equipment_id
     WHERE ve.vehicle_id = ?
     ORDER BY e.equipment_name ASC`,
    [vehicleId]
  );
  return rows;
}

module.exports = {
  getEquipmentsPaged,
  getAllEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  searchEquipments,
  getEquipmentsByBooking,
  getEquipmentsByVehicle
};
