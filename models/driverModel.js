// models/driverModel.js
// ฟังก์ชันติดต่อฐานข้อมูลตาราง drivers

const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/**
 * ดึงรายการคนขับทั้งหมด
 * @returns {Promise<Array>} รายการคนขับ
 */
async function getAllDrivers() {
  const sql = `SELECT * FROM drivers ORDER BY created_at DESC`;
  const [rows] = await db.query(sql);
  return rows;
}

/**
 * ดึงคนขับตาม ID
 * @param {string} driverId
 * @returns {Promise<Object|null>} รายละเอียดคนขับหรือ null
 */
async function getDriverById(driverId) {
  const sql = `SELECT * FROM drivers WHERE driver_id = ? LIMIT 1`;
  const [rows] = await db.query(sql, [driverId]);
  return rows[0] || null;
}

/**
 * สร้างคนขับใหม่
 * @param {Object} data ข้อมูลคนขับจาก req.body
 * @returns {Promise<Object>} คนขับที่สร้างใหม่
 */
async function createDriver(data) {
  const driverId = uuidv4().replace(/-/g, ''); // UUID แบบไม่มีขีด
  const { name, phone } = data;
  
  const sql = `
    INSERT INTO drivers (driver_id, name, phone) 
    VALUES (?, ?, ?)
  `;
  
  await db.query(sql, [driverId, name, phone]);
  
  // ดึงข้อมูลคนขับที่เพิ่งสร้าง
  return await getDriverById(driverId);
}

/**
 * อัปเดตข้อมูลคนขับ
 * @param {string} driverId รหัสคนขับ
 * @param {Object} data ข้อมูลที่ต้องการอัปเดต
 * @returns {Promise<Object|null>} คนขับที่อัปเดตแล้วหรือ null
 */
async function updateDriver(driverId, data) {
  const { name, phone } = data;
  
  const sql = `
    UPDATE drivers 
    SET name = ?, phone = ?
    WHERE driver_id = ?
  `;
  
  const [result] = await db.query(sql, [name, phone, driverId]);
  
  if (result.affectedRows === 0) {
    return null; // ไม่พบคนขับที่ต้องการอัปเดต
  }
  
  // ดึงข้อมูลคนขับที่อัปเดตแล้ว
  return await getDriverById(driverId);
}

/**
 * ลบคนขับ
 * @param {string} driverId รหัสคนขับ
 * @returns {Promise<boolean>} true ถ้าลบสำเร็จ, false ถ้าไม่พบ
 */
async function deleteDriver(driverId) {
  const sql = `DELETE FROM drivers WHERE driver_id = ?`;
  const [result] = await db.query(sql, [driverId]);
  
  return result.affectedRows > 0;
}

/**
 * ดึงรายการคนขับที่ว่างในช่วงเวลาที่กำหนด
 * @param {string} startDate วันที่เริ่มต้น (YYYY-MM-DD HH:mm:ss)
 * @param {string} endDate วันที่สิ้นสุด (YYYY-MM-DD HH:mm:ss)
 * @returns {Promise<Array>} รายการคนขับที่ว่าง
 */
async function getAvailableDrivers(startDate, endDate) {
  const sql = `
    SELECT d.* 
    FROM drivers d
    WHERE d.driver_id NOT IN (
      SELECT DISTINCT b.driver_id 
      FROM bookings b 
      WHERE b.driver_id IS NOT NULL
        AND b.status IN ('approved', 'in_progress')
        AND (
          (b.start_date <= ? AND b.end_date >= ?) OR
          (b.start_date <= ? AND b.end_date >= ?) OR
          (b.start_date >= ? AND b.end_date <= ?)
        )
    )
    ORDER BY d.name
  `;
  
  const [rows] = await db.query(sql, [
    startDate, startDate,  // ตรวจสอบว่าช่วงใหม่เริ่มในช่วงเดิม
    endDate, endDate,      // ตรวจสอบว่าช่วงใหม่จบในช่วงเดิม
    startDate, endDate     // ตรวจสอบว่าช่วงใหม่ครอบคลุมช่วงเดิม
  ]);
  
  return rows;
}

/**
 * ตรวจสอบว่าคนขับว่างในช่วงเวลาที่กำหนดหรือไม่
 * @param {string} driverId รหัสคนขับ
 * @param {string} startDate วันที่เริ่มต้น
 * @param {string} endDate วันที่สิ้นสุด
 * @returns {Promise<boolean>} true ถ้าว่าง, false ถ้าไม่ว่าง
 */
async function isDriverAvailable(driverId, startDate, endDate) {
  const sql = `
    SELECT COUNT(*) as count
    FROM bookings 
    WHERE driver_id = ?
      AND status IN ('approved', 'in_progress')
      AND (
        (start_date <= ? AND end_date >= ?) OR
        (start_date <= ? AND end_date >= ?) OR
        (start_date >= ? AND end_date <= ?)
      )
  `;
  
  const [rows] = await db.query(sql, [
    driverId,
    startDate, startDate,
    endDate, endDate,
    startDate, endDate
  ]);
  
  return rows[0].count === 0;
}

module.exports = {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getAvailableDrivers,
  isDriverAvailable
};