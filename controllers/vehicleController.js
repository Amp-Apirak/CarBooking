// controllers/vehicleController.js
// ควบคุมการทำงานเกี่ยวกับ Vehicles ทั้งหมด

const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
} = require('../models/vehicleModel');

/**
 * GET /api/vehicles
 * ดึงรายการรถทั้งหมด
 */
exports.list = async (req, res) => {
  try {
    const vehicles = await getAllVehicles();
    res.json(vehicles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถดึงรายการรถได้' });
  }
};

/**
 * GET /api/vehicles/:id
 * ดึงรายละเอียดรถตาม ID
 */
exports.getById = async (req, res) => {
  try {
    const vehicle = await getVehicleById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'ไม่พบรถที่ระบุ' });
    }
    res.json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดขณะดึงข้อมูลรถ' });
  }
};

/**
 * POST /api/vehicles
 * สร้างรถใหม่
 */
exports.create = async (req, res) => {
  try {
    const id = await createVehicle(req.body);
    res.status(201).json({ vehicle_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถสร้างรถใหม่ได้' });
  }
};

/**
 * PUT /api/vehicles/:id
 * แก้ไขข้อมูลรถ
 */
exports.update = async (req, res) => {
  try {
    await updateVehicle(req.params.id, req.body);
    res.json({ message: 'อัปเดตรถเรียบร้อย' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถอัปเดตรถได้' });
  }
};

/**
 * DELETE /api/vehicles/:id
 * ลบรถตาม ID
 */
exports.remove = async (req, res) => {
  try {
    await deleteVehicle(req.params.id);
    res.json({ message: 'ลบรถเรียบร้อย' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ไม่สามารถลบรถได้' });
  }
};
