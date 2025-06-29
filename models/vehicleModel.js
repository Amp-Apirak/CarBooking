// models/vehicleModel.js
// ฟังก์ชันติดต่อฐานข้อมูลตาราง vehicles

const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

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
  // ตรวจสอบว่า type_id มีอยู่ใน vehicle_types หรือไม่
  const typeCheckSql = `SELECT COUNT(*) AS count FROM vehicle_types WHERE type_id = ?`;
  const [[{ count }]] = await db.query(typeCheckSql, [data.type_id]);

  if (count === 0) {
    throw new Error(`Invalid type_id: ${data.type_id}`);
  }

  const id = uuidv4().replace(/-/g, "");
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
    data.is_public || false,
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
    vehicleId,
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

// ดึงรายการรถแบบมี pagination
async function getVehiclesPaged(limit, offset) {
  // 1) ดึงข้อมูลหลัก
  const [rows] = await db.query(
    `SELECT * FROM vehicles ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    [limit, offset]
  );

  // 2) ดึง total count
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM vehicles`
  );

  return { rows, total };
}

// ---------------------------------  ประเภทยานพาหนะ ------------------------------------ //

// ฟังก์ชันดึงรายการประเภทยานพาหนะทั้งหมด
const getAllVehicleTypes = async (limit, offset) => {
  const sql = `SELECT * FROM vehicle_types LIMIT ? OFFSET ?`;
  const [rows] = await db.query(sql, [limit, offset]);
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM vehicle_types`
  );
  return { rows, total };
};

// ดึงรายการประเภทยานพาหนะตามไอดี
async function getVehicleTypeById(typeId) {
  const sql = `SELECT * FROM vehicle_types WHERE type_id = ? LIMIT 1`;
  const [rows] = await db.query(sql, [typeId]);
  return rows[0] || null;
}

// สร้างประเภทใหม่
async function createType(name) {
  const id = uuidv4().replace(/-/g, "");
  const sql = `INSERT INTO vehicle_types (type_id, name) VALUES (?, ?)`;
  await db.query(sql, [id, name]);
  return id;
}

// แก้ไขประเภท
async function updateType(typeId, name) {
  const sql = `UPDATE vehicle_types SET name = ? WHERE type_id = ?`;
  await db.query(sql, [name, typeId]);
}

// ลบประเภท
async function deleteType(typeId) {
  const sql = `DELETE FROM vehicle_types WHERE type_id = ?`;
  await db.query(sql, [typeId]);
}

// ---------------------------------  ยี่ห้อพาหนะ ------------------------------------ //

// ฟังก์ชันดึงรายการยี่ห้อรถทั้งหมด
const getAllVehicleBrands = async (limit, offset) => {
  const sql = `SELECT * FROM vehicle_brands LIMIT ? OFFSET ?`;
  const [rows] = await db.query(sql, [limit, offset]);
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM vehicle_brands`
  );
  return { rows, total };
};

// ดึงรายการยี่ห้อรถตามไอดี
async function getVehicleBrandById(brandId) {
  const sql = `SELECT * FROM vehicle_brands WHERE brand_id = ? LIMIT 1`;
  const [rows] = await db.query(sql, [brandId]);
  return rows[0] || null;
}

// สร้างยี่ห้อใหม่
async function createBrand(name) {
  const id = uuidv4().replace(/-/g, "");
  const sql = `INSERT INTO vehicle_brands (brand_id, name) VALUES (?, ?)`;
  await db.query(sql, [id, name]);
  return id;
}

// แก้ไขยี่ห้อ
async function updateBrand(brandId, name) {
  const sql = `UPDATE vehicle_brands SET name = ? WHERE brand_id = ?`;
  await db.query(sql, [name, brandId]);
}

// ลบยี่ห้อ
async function deleteBrand(brandId) {
  const sql = `DELETE FROM vehicle_brands WHERE brand_id = ?`;
  await db.query(sql, [brandId]);
}

/**
 * ดึงรายการรถที่ว่างในช่วงเวลาที่กำหนด
 * @param {string} startDate วันที่เริ่มต้น (YYYY-MM-DD HH:mm:ss)
 * @param {string} endDate วันที่สิ้นสุด (YYYY-MM-DD HH:mm:ss)
 * @param {Object} filters ตัวกรองเพิ่มเติม
 * @returns {Promise<Array>} รายการรถที่ว่าง
 */
async function getAvailableVehicles(startDate, endDate, filters = {}) {
  let sql = `
    SELECT 
      v.*,
      vt.name as type_name,
      vb.name as brand_name
    FROM vehicles v
    LEFT JOIN vehicle_types vt ON v.type_id = vt.type_id
    LEFT JOIN vehicle_brands vb ON v.brand_id = vb.brand_id
    WHERE v.status = 'active'
      AND v.vehicle_id NOT IN (
        SELECT DISTINCT b.vehicle_id 
        FROM bookings b 
        WHERE b.vehicle_id IS NOT NULL
          AND b.status IN ('approved', 'in_progress')
          AND (
            (b.start_date <= ? AND b.end_date >= ?) OR
            (b.start_date <= ? AND b.end_date >= ?) OR
            (b.start_date >= ? AND b.end_date <= ?)
          )
      )
  `;
  
  const params = [
    startDate, startDate,  // ตรวจสอบว่าช่วงใหม่เริ่มในช่วงเดิม
    endDate, endDate,      // ตรวจสอบว่าช่วงใหม่จบในช่วงเดิม
    startDate, endDate     // ตรวจสอบว่าช่วงใหม่ครอบคลุมช่วงเดิม
  ];
  
  // เพิ่มตัวกรองตามประเภทรถ
  if (filters.type_id) {
    sql += ' AND v.type_id = ?';
    params.push(filters.type_id);
  }
  
  // เพิ่มตัวกรองตามยี่ห้อ
  if (filters.brand_id) {
    sql += ' AND v.brand_id = ?';
    params.push(filters.brand_id);
  }
  
  // เพิ่มตัวกรองตามจำนวนที่นั่ง
  if (filters.min_seats) {
    sql += ' AND v.seats >= ?';
    params.push(parseInt(filters.min_seats));
  }
  
  // เพิ่มตัวกรองตามสถานที่
  if (filters.location) {
    sql += ' AND v.location LIKE ?';
    params.push(`%${filters.location}%`);
  }
  
  sql += ' ORDER BY v.license_plate';
  
  // เพิ่ม limit ถ้ามี
  if (filters.limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(filters.limit));
  }
  
  const [rows] = await db.query(sql, params);
  return rows;
}

/**
 * ตรวจสอบว่ารถคันนั้นว่างในช่วงเวลาที่กำหนดหรือไม่
 * @param {string} vehicleId รหัสรถ
 * @param {string} startDate วันที่เริ่มต้น
 * @param {string} endDate วันที่สิ้นสุด
 * @param {string} excludeBookingId รหัสการจองที่ต้องการยกเว้น (สำหรับการแก้ไข)
 * @returns {Promise<boolean>} true ถ้าว่าง, false ถ้าไม่ว่าง
 */
async function isVehicleAvailable(vehicleId, startDate, endDate, excludeBookingId = null) {
  let sql = `
    SELECT COUNT(*) as count
    FROM bookings 
    WHERE vehicle_id = ?
      AND status IN ('approved', 'in_progress')
      AND (
        (start_date <= ? AND end_date >= ?) OR
        (start_date <= ? AND end_date >= ?) OR
        (start_date >= ? AND end_date <= ?)
      )
  `;
  
  const params = [
    vehicleId,
    startDate, startDate,
    endDate, endDate,
    startDate, endDate
  ];
  
  // ยกเว้นการจองนั้นๆ (สำหรับการแก้ไข)
  if (excludeBookingId) {
    sql += ' AND booking_id != ?';
    params.push(excludeBookingId);
  }
  
  const [rows] = await db.query(sql, params);
  return rows[0].count === 0;
}

/**
 * ดึงรายการการจองที่ทับซ้อนกับช่วงเวลาที่กำหนด
 * @param {string} vehicleId รหัสรถ
 * @param {string} startDate วันที่เริ่มต้น
 * @param {string} endDate วันที่สิ้นสุด
 * @returns {Promise<Array>} รายการการจองที่ขัดแย้ง
 */
async function getVehicleBookingConflicts(vehicleId, startDate, endDate) {
  const sql = `
    SELECT 
      b.booking_id,
      b.start_date,
      b.end_date,
      b.status,
      u.first_name,
      u.last_name,
      u.username
    FROM bookings b
    LEFT JOIN users u ON b.user_id = u.user_id
    WHERE b.vehicle_id = ?
      AND b.status IN ('approved', 'in_progress')
      AND (
        (b.start_date <= ? AND b.end_date >= ?) OR
        (b.start_date <= ? AND b.end_date >= ?) OR
        (b.start_date >= ? AND b.end_date <= ?)
      )
    ORDER BY b.start_date
  `;
  
  const params = [
    vehicleId,
    startDate, startDate,
    endDate, endDate,
    startDate, endDate
  ];
  
  const [rows] = await db.query(sql, params);
  return rows;
}

module.exports = {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  getAllVehicleTypes,
  getAllVehicleBrands,
  deleteVehicle,
  createType,
  updateType,
  deleteType,
  createBrand,
  updateBrand,
  deleteBrand,
  getVehicleTypeById,
  getVehicleBrandById,
  getVehiclesPaged,
  getAvailableVehicles,
  isVehicleAvailable,
  getVehicleBookingConflicts,
};
