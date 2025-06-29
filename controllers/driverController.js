// controllers/driverController.js
// ควบคุมการทำงานเกี่ยวกับ Drivers ทั้งหมด

const {
  getAllDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
  getAvailableDrivers,
  isDriverAvailable
} = require("../models/driverModel");

/**
 * GET /api/drivers
 * ดึงรายการคนขับทั้งหมด
 */
exports.list = async (req, res) => {
  try {
    const drivers = await getAllDrivers();
    res.json({
      success: true,
      data: drivers,
      total: drivers.length
    });
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลคนขับ",
      error: error.message
    });
  }
};

/**
 * GET /api/drivers/:id
 * ดึงข้อมูลคนขับตาม ID
 */
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const driver = await getDriverById(id);
    
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคนขับที่ต้องการ"
      });
    }
    
    res.json({
      success: true,
      data: driver
    });
  } catch (error) {
    console.error("Error fetching driver:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลคนขับ",
      error: error.message
    });
  }
};

/**
 * POST /api/drivers
 * เพิ่มคนขับใหม่
 */
exports.create = async (req, res) => {
  try {
    const { name, phone } = req.body;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกชื่อคนขับ"
      });
    }
    
    const newDriver = await createDriver({ name, phone });
    
    res.status(201).json({
      success: true,
      message: "เพิ่มคนขับสำเร็จ",
      data: newDriver
    });
  } catch (error) {
    console.error("Error creating driver:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการเพิ่มคนขับ",
      error: error.message
    });
  }
};

/**
 * PUT /api/drivers/:id
 * อัปเดตข้อมูลคนขับ
 */
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone } = req.body;
    
    // ตรวจสอบข้อมูลที่จำเป็น
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "กรุณากรอกชื่อคนขับ"
      });
    }
    
    const updatedDriver = await updateDriver(id, { name, phone });
    
    if (!updatedDriver) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคนขับที่ต้องการอัปเดต"
      });
    }
    
    res.json({
      success: true,
      message: "อัปเดตข้อมูลคนขับสำเร็จ",
      data: updatedDriver
    });
  } catch (error) {
    console.error("Error updating driver:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการอัปเดตข้อมูลคนขับ",
      error: error.message
    });
  }
};

/**
 * DELETE /api/drivers/:id
 * ลบคนขับ
 */
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleted = await deleteDriver(id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคนขับที่ต้องการลบ"
      });
    }
    
    res.json({
      success: true,
      message: "ลบคนขับสำเร็จ"
    });
  } catch (error) {
    console.error("Error deleting driver:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการลบคนขับ",
      error: error.message
    });
  }
};

/**
 * GET /api/drivers/available
 * ดึงรายการคนขับที่ว่างในช่วงเวลาที่กำหนด
 * Query params: start_date, end_date
 */
exports.getAvailable = async (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    // ตรวจสอบ parameter ที่จำเป็น
    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "กรุณาระบุ start_date และ end_date"
      });
    }
    
    const availableDrivers = await getAvailableDrivers(start_date, end_date);
    
    res.json({
      success: true,
      data: availableDrivers,
      total: availableDrivers.length,
      period: {
        start_date,
        end_date
      }
    });
  } catch (error) {
    console.error("Error fetching available drivers:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลคนขับที่ว่าง",
      error: error.message
    });
  }
};

/**
 * GET /api/drivers/:id/availability
 * ตรวจสอบว่าคนขับว่างในช่วงเวลาที่กำหนดหรือไม่
 * Query params: start_date, end_date
 */
exports.checkAvailability = async (req, res) => {
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
    
    // ตรวจสอบว่าคนขับมีอยู่จริง
    const driver = await getDriverById(id);
    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "ไม่พบคนขับที่ต้องการ"
      });
    }
    
    const isAvailable = await isDriverAvailable(id, start_date, end_date);
    
    res.json({
      success: true,
      data: {
        driver_id: id,
        driver_name: driver.name,
        is_available: isAvailable,
        period: {
          start_date,
          end_date
        }
      }
    });
  } catch (error) {
    console.error("Error checking driver availability:", error);
    res.status(500).json({
      success: false,
      message: "เกิดข้อผิดพลาดในการตรวจสอบความพร้อมของคนขับ",
      error: error.message
    });
  }
};