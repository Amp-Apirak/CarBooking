// models/vehicleModel.js
// ฟังก์ชันติดต่อฐานข้อมูลตาราง vehicles

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * ดึงรายการรถทั้งหมด
 * @returns {Promise<Array>} รายการรถ
 */
async function getAllVehicles() {
  const sql = `SELECT * FROM vehicles`;
  const [rows] = await db.query(sql);
  return rows;
}

/**
 * ดึงรถตาม ID
 * @param {string} vehicleId
 * @returns {Promise<Object|null>} รายละเอียดรถหรือ null
 */
async function getVehicleById(vehicleId) {
  const sql = `SELECT * FROM vehicles WHERE vehicle_id = ? LIMIT 1`;
  const [rows] = await db.query(sql, [vehicleId]);
  return rows[0] || null;
}

/**
 * สร้างรถใหม่
 * @param {Object} data ข้อมูลรถจาก req.body
 * @returns {Promise<string>} คืนค่า vehicle_id ที่สร้าง
 */
async function createVehicle(data) {
  const id = uuidv4().replace(/-/g, '');
  const sql = `
    INSERT INTO vehicles 
      (vehicle_id, license_plate, type_id, brand_id, capacity, color, description, image_path, is_public)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    id,
    data.license_plate,
    data.type_id,
    data.brand_id,
    data.capacity,
    data.color,
    data.description,
    data.image_path || null,
    data.is_public || false
  ];
  await db.query(sql, params);
  return id;
}

/**
 * แก้ไขข้อมูลรถ
 * @param {string} vehicleId
 * @param {Object} data ข้อมูลใหม่
 */
async function updateVehicle(vehicleId, data) {
  const sql = `
    UPDATE vehicles SET
      license_plate = ?, type_id = ?, brand_id = ?, capacity = ?, color = ?, description = ?, image_path = ?, is_public = ?
    WHERE vehicle_id = ?
  `;
  const params = [
    data.license_plate,
    data.type_id,
    data.brand_id,
    data.capacity,
    data.color,
    data.description,
    data.image_path || null,
    data.is_public || false,
    vehicleId
  ];
  await db.query(sql, params);
}

/**
 * ลบรถตาม ID
 * @param {string} vehicleId
 */
async function deleteVehicle(vehicleId) {
  const sql = `DELETE FROM vehicles WHERE vehicle_id = ?`;
  await db.query(sql, [vehicleId]);
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
