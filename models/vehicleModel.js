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
};


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
};
