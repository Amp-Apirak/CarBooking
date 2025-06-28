// controllers/equipmentController.js
// ควบคุมการทำงานเกี่ยวกับ Equipment ทั้งหมด

const {
  getEquipmentsPaged,
  getAllEquipments,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
  searchEquipments,
  getEquipmentsByBooking,
  getEquipmentsByVehicle
} = require('../models/equipmentModel');

/**
 * GET /api/equipments
 * ดึงรายการอุปกรณ์ทั้งหมด (รองรับ pagination และ search)
 */
exports.list = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;
    const search = req.query.search;

    let result;
    if (search) {
      result = await searchEquipments(search, limit, offset);
    } else {
      result = await getEquipmentsPaged(limit, offset);
    }

    res.json({
      data: result.rows,
      pagination: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
      search: search || null
    });
  } catch (err) {
    console.error('Error in GET /equipments:', err);
    res.status(500).json({ error: 'ไม่สามารถดึงรายการอุปกรณ์ได้' });
  }
};

/**
 * GET /api/equipments/all
 * ดึงรายการอุปกรณ์ทั้งหมด (ไม่มี pagination) สำหรับ dropdown
 */
exports.listAll = async (req, res) => {
  try {
    const equipments = await getAllEquipments();
    res.json({
      data: equipments,
      total: equipments.length
    });
  } catch (err) {
    console.error('Error in GET /equipments/all:', err);
    res.status(500).json({ error: 'ไม่สามารถดึงรายการอุปกรณ์ได้' });
  }
};

/**
 * GET /api/equipments/:id
 * ดึงรายละเอียดอุปกรณ์ตาม ID
 */
exports.getById = async (req, res) => {
  try {
    const equipment = await getEquipmentById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'ไม่พบอุปกรณ์ที่ระบุ' });
    }
    res.json(equipment);
  } catch (err) {
    console.error('Error in GET /equipments/:id:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดขณะดึงข้อมูลอุปกรณ์' });
  }
};

/**
 * POST /api/equipments
 * สร้างอุปกรณ์ใหม่
 */
exports.create = async (req, res) => {
  try {
    const { equipment_name, description } = req.body;
    
    if (!equipment_name || !description) {
      return res.status(400).json({ 
        error: 'กรุณาระบุชื่ออุปกรณ์และคำอธิบาย' 
      });
    }

    const id = await createEquipment(req.body);
    res.status(201).json({ 
      equipment_id: id,
      message: 'สร้างอุปกรณ์เรียบร้อย'
    });
  } catch (err) {
    console.error('Error in POST /equipments:', err);
    res.status(500).json({ error: 'ไม่สามารถสร้างอุปกรณ์ได้' });
  }
};

/**
 * PUT /api/equipments/:id
 * แก้ไขข้อมูลอุปกรณ์
 */
exports.update = async (req, res) => {
  try {
    const equipment = await getEquipmentById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'ไม่พบอุปกรณ์ที่ระบุ' });
    }

    await updateEquipment(req.params.id, req.body);
    res.json({ message: 'อัปเดตข้อมูลอุปกรณ์เรียบร้อย' });
  } catch (err) {
    console.error('Error in PUT /equipments/:id:', err);
    res.status(500).json({ error: 'ไม่สามารถอัปเดตข้อมูลอุปกรณ์ได้' });
  }
};

/**
 * DELETE /api/equipments/:id
 * ลบอุปกรณ์ตาม ID
 */
exports.remove = async (req, res) => {
  try {
    const equipment = await getEquipmentById(req.params.id);
    if (!equipment) {
      return res.status(404).json({ error: 'ไม่พบอุปกรณ์ที่ระบุ' });
    }

    await deleteEquipment(req.params.id);
    res.json({ message: 'ลบอุปกรณ์เรียบร้อย' });
  } catch (err) {
    console.error('Error in DELETE /equipments/:id:', err);
    if (err.message.includes('ไม่สามารถลบอุปกรณ์ได้')) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'ไม่สามารถลบอุปกรณ์ได้' });
    }
  }
};

/**
 * GET /api/equipments/booking/:bookingId
 * ดึงอุปกรณ์ที่ใช้ในการจองเฉพาะ (พร้อมจำนวน)
 */
exports.getByBooking = async (req, res) => {
  try {
    const equipments = await getEquipmentsByBooking(req.params.bookingId);
    res.json({
      data: equipments,
      total: equipments.length,
      booking_id: req.params.bookingId
    });
  } catch (err) {
    console.error('Error in GET /equipments/booking/:bookingId:', err);
    res.status(500).json({ error: 'ไม่สามารถดึงรายการอุปกรณ์ของการจองได้' });
  }
};

/**
 * GET /api/equipments/vehicle/:vehicleId
 * ดึงอุปกรณ์ที่เชื่อมโยงกับรถเฉพาะ
 */
exports.getByVehicle = async (req, res) => {
  try {
    const equipments = await getEquipmentsByVehicle(req.params.vehicleId);
    res.json({
      data: equipments,
      total: equipments.length,
      vehicle_id: req.params.vehicleId
    });
  } catch (err) {
    console.error('Error in GET /equipments/vehicle/:vehicleId:', err);
    res.status(500).json({ error: 'ไม่สามารถดึงรายการอุปกรณ์ของรถได้' });
  }
};

module.exports = {
  list: exports.list,
  listAll: exports.listAll,
  getById: exports.getById,
  create: exports.create,
  update: exports.update,
  remove: exports.remove,
  getByBooking: exports.getByBooking,
  getByVehicle: exports.getByVehicle
};
