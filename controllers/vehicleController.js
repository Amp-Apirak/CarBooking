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
  getAvailableVehicles,
  isVehicleAvailable,
  getVehicleBookingConflicts,
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

/**
 * GET /api/vehicles/available
 * ดึงรายการรถที่ว่างในช่วงเวลาที่กำหนด
 */
exports.getAvailable = async (req, res) => {
  try {
    const { 
      start_date, 
      end_date, 
      type_id, 
      brand_id, 
      min_seats, 
      location, 
      limit 
    } = req.query;
    
    // ตรวจสอบ parameter ที่จำเป็น
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุ start_date และ end_date"
      });
    }
    
    // ตรวจสอบรูปแบบวันที่
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({
        success: false,
        message: "รูปแบบวันที่ไม่ถูกต้อง"
      });
    }
    
    if (startDate >= endDate) {
      return res.status(400).json({
        success: false,
        message: "วันที่เริ่มต้นต้องน้อยกว่าวันที่สิ้นสุด"
      });
    }
    
    const filters = {
      type_id,
      brand_id,
      min_seats,
      location,
      limit
    };
    
    const availableVehicles = await getAvailableVehicles(start_date, end_date, filters);
    
    res.json({
      success: true,
      data: availableVehicles,
      total: availableVehicles.length,
      period: {
        start_date,
        end_date
      },
      filters: filters
    });
  } catch (error) {
    console.error("Error fetching available vehicles:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลรถที่ว่าง",
      error: error.message
    });
  }
};

/**
 * GET /api/vehicles/:id/availability
 * ตรวจสอบว่ารถคันนั้นว่างในช่วงเวลาที่กำหนดหรือไม่
 */
exports.checkAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date, exclude_booking_id } = req.query;
    
    // ตรวจสอบ parameter ที่จำเป็น
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุ start_date และ end_date"
      });
    }
    
    // ตรวจสอบว่ารถมีอยู่จริง
    const vehicle = await getVehicleById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบรถที่ต้องการ"
      });
    }
    
    // ตรวจสอบความพร้อม
    const isAvailable = await isVehicleAvailable(id, start_date, end_date, exclude_booking_id);
    
    // ถ้าไม่ว่าง ให้ดึงรายการการจองที่ขัดแย้ง
    let conflicts = [];
    if (!isAvailable) {
      conflicts = await getVehicleBookingConflicts(id, start_date, end_date);
    }
    
    res.json({
      success: true,
      data: {
        vehicle_id: id,
        vehicle_info: {
          license_plate: vehicle.license_plate,
          model: vehicle.model,
          brand: vehicle.brand,
          type: vehicle.type
        },
        is_available: isAvailable,
        period: {
          start_date,
          end_date
        },
        conflicts: conflicts
      }
    });
  } catch (error) {
    console.error("Error checking vehicle availability:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบความพร้อมของรถ",
      error: error.message
    });
  }
};

/**
 * GET /api/vehicles/:id/conflicts
 * ดึงรายการการจองที่ทับซ้อนกับช่วงเวลาที่กำหนด
 */
exports.getBookingConflicts = async (req, res) => {
  try {
    const { id } = req.params;
    const { start_date, end_date } = req.query;
    
    // ตรวจสอบ parameter ที่จำเป็น
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุ start_date และ end_date"
      });
    }
    
    // ตรวจสอบว่ารถมีอยู่จริง
    const vehicle = await getVehicleById(id);
    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบรถที่ต้องการ"
      });
    }
    
    const conflicts = await getVehicleBookingConflicts(id, start_date, end_date);
    
    res.json({
      success: true,
      data: conflicts,
      total: conflicts.length,
      vehicle_info: {
        vehicle_id: id,
        license_plate: vehicle.license_plate,
        model: vehicle.model
      },
      period: {
        start_date,
        end_date
      }
    });
  } catch (error) {
    console.error("Error fetching booking conflicts:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลการจองที่ขัดแย้ง",
      error: error.message
    });
  }
};
