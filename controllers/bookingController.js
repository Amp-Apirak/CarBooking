// controllers/bookingController.js
// ควบคุมการทำงานเกี่ยวกับ Booking Workflow ทั้งหมด

const {
  getBookingsPaged,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking
} = require('../models/bookingModel');

/**
 * GET /api/bookings
 * ดึงรายการการจองทั้งหมด (รองรับ pagination)
 */
exports.list = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page  = parseInt(req.query.page)  || 1;
    const offset = (page - 1) * limit;

    const { rows, total } = await getBookingsPaged(limit, offset);
    res.json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    console.error('Error in GET /bookings:', err);
    res.status(500).json({ error: 'ไม่สามารถดึงรายการการจองได้' });
  }
};

/**
 * GET /api/bookings/:id
 * ดึงรายละเอียดการจองตาม ID
 */
exports.getById = async (req, res) => {
  try {
    const booking = await getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'ไม่พบการจองที่ระบุ' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Error in GET /bookings/:id:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดขณะดึงการจอง' });
  }
};

/**
 * POST /api/bookings
 * สร้างการจองใหม่
 */
exports.create = async (req, res) => {
  try {
    const id = await createBooking(req.body);
    res.status(201).json({ booking_id: id });
  } catch (err) {
    console.error('Error in POST /bookings:', err);
    res.status(500).json({ error: 'ไม่สามารถสร้างการจองได้' });
  }
};

/**
 * PUT /api/bookings/:id
 * แก้ไขข้อมูลการจอง
 */
exports.update = async (req, res) => {
  try {
    await updateBooking(req.params.id, req.body);
    res.json({ message: 'อัปเดตการจองเรียบร้อย' });
  } catch (err) {
    console.error('Error in PUT /bookings/:id:', err);
    res.status(500).json({ error: 'ไม่สามารถอัปเดตการจองได้' });
  }
};

/**
 * DELETE /api/bookings/:id
 * ลบการจองตาม ID
 */
exports.remove = async (req, res) => {
  try {
    await deleteBooking(req.params.id);
    res.json({ message: 'ลบการจองเรียบร้อย' });
  } catch (err) {
    console.error('Error in DELETE /bookings/:id:', err);
    res.status(500).json({ error: 'ไม่สามารถลบการจองได้' });
  }
};
