// controllers/vehicleController.js
// ควบคุมการทำงานเกี่ยวกับ Vehicles ทั้งหมด

const {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getAllVehicleTypes,
  getAllVehicleBrands,
  getVehicleTypeById,
  getVehicleBrandById,
  createType,
  updateType,
  deleteType,
  createBrand,
  updateBrand,
  deleteBrand,
  getVehiclesPaged,
} = require("../models/vehicleModel");

/**
 * GET /api/vehicles
 * ดึงรายการรถทั้งหมด
 */
exports.list = async (req, res) => {
  try {
    // อ่านจาก query string (default: limit=10, page=1)
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    // เรียก model
    const { rows, total } = await getVehiclesPaged(limit, offset);

    // ตอบกลับพร้อม metadata
    res.json({
      data: rows,
      pagination: {
        total, // จำนวนทั้งหมด
        page, // หน้า current
        limit, // per page
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ไม่สามารถดึงรายการรถได้" });
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
      return res.status(404).json({ error: "ไม่พบรถที่ระบุ" });
    }
    res.json(vehicle);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดขณะดึงข้อมูลรถ" });
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
    res.status(500).json({ error: "ไม่สามารถสร้างรถใหม่ได้" });
  }
};

/**
 * PUT /api/vehicles/:id
 * แก้ไขข้อมูลรถ
 */
exports.update = async (req, res) => {
  try {
    await updateVehicle(req.params.id, req.body);
    res.json({ message: "อัปเดตรถเรียบร้อย" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ไม่สามารถอัปเดตรถได้" });
  }
};

/**
 * DELETE /api/vehicles/:id
 * ลบรถตาม ID
 */
exports.remove = async (req, res) => {
  try {
    await deleteVehicle(req.params.id);
    res.json({ message: "ลบรถเรียบร้อย" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ไม่สามารถลบรถได้" });
  }
};

// ---------------------------------  ประเภทยานพาหนะ ------------------------------------ //

/**
 * GET /api/vehicle/types
 * ดึงรายการประเภทยานพาหนะทั้งหมด
 */
exports.listTypes = async (req, res) => {
  try {
    // อ่านจาก query string (default: limit=10, page=1)
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    // เรียก model
    const { rows, total } = await getAllVehicleTypes(limit, offset);

    // ตอบกลับพร้อม metadata
    res.json({
      data: rows,
      pagination: {
        total, // จำนวนทั้งหมด
        page, // หน้า current
        limit, // per page
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถดึงประเภทยานพาหนะได้" });
  }
};

/**
 * POST /api/vehicle/types/:id
 * ดึงรายการประเภทยานพาหนะไอดี
 */
exports.getTypeById = async (req, res) => {
  try {
    const type = await getVehicleTypeById(req.params.id);
    if (!type) {
      return res.status(404).json({ error: "ไม่พบประเภท" });
    }
    res.json(type);
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถดึงประเภทยานพาหนะได้" });
  }
};

// POST /api/vehicle/types
exports.createType = async (req, res) => {
  try {
    const id = await createType(req.body.name);
    res.status(201).json({ type_id: id });
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถสร้างประเภทยานพาหนะได้" });
  }
};

// PUT /api/vehicle/types/:id
exports.updateType = async (req, res) => {
  try {
    await updateType(req.params.id, req.body.name);
    res.json({ message: "แก้ไขประเภทยานพาหนะเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถแก้ไขประเภทยานพาหนะได้" });
  }
};

// DELETE /api/vehicle/types/:id
exports.deleteType = async (req, res) => {
  try {
    await deleteType(req.params.id);
    res.json({ message: "ลบประเภทยานพาหนะเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถลบประเภทยานพาหนะได้" });
  }
};

// ---------------------------------  ยี่ห้อพาหนะ ------------------------------------ //

/**
 * GET /api/vehicle/brands
 * ดึงรายการยี่ห้อรถทั้งหมด
 */
exports.listBrands = async (req, res) => {
  try {
    // อ่านจาก query string (default: limit=10, page=1)
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    // เรียก model
    const { rows, total } = await getAllVehicleBrands(limit, offset);

    // ตอบกลับพร้อม metadata
    res.json({
      data: rows,
      pagination: {
        total, // จำนวน
        page, // หน้า current
        limit, // per page
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ไม่สามารถดึงยี่ห้อรถได้" });
  }
};

/**
 * POST /api/vehicle-types /:id
 * ดึงรายการประเภทยานพาหนะไอดี
 */
exports.getBrandById = async (req, res) => {
  try {
    const brand = await getVehicleBrandById(req.params.id);
    if (!brand) {
      return res.status(404).json({ error: "ไม่พบยี่ห้อ" });
    }
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถดึงยี่ห้อได้" });
  }
};

// POST /api/vehicle/brands
exports.createBrand = async (req, res) => {
  try {
    const id = await createBrand(req.body.name);
    res.status(201).json({ brand_id: id });
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถสร้างยี่ห้อรถได้" });
  }
};

// PUT /api/vehicle/brands/:id
exports.updateBrand = async (req, res) => {
  try {
    await updateBrand(req.params.id, req.body.name);
    res.json({ message: "แก้ไขยี่ห้อรถเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถแก้ไขยี่ห้อรถได้" });
  }
};

// DELETE /api/vehicle/brands/:id
exports.deleteBrand = async (req, res) => {
  try {
    await deleteBrand(req.params.id);
    res.json({ message: "ลบยี่ห้อรถเรียบร้อย" });
  } catch (err) {
    res.status(500).json({ error: "ไม่สามารถลบยี่ห้อรถได้" });
  }
};
