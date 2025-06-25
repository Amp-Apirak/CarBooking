// controllers/bookingController.js
// ควบคุมการทำงานเกี่ยวกับ Booking Workflow ทั้งหมด

const {
  getBookingsPaged,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getApprovalMeta,
  updateApprovalStatus,
} = require("../models/bookingModel");

const approvalStatusModel = require("../models/bookingApprovalStatusModel");
const approvalLogModel = require("../models/bookingApprovalLogModel");
const approvalStepModel = require("../models/approvalStepModel");
const userModel = require("../models/userModel");

/**
 * GET /api/bookings
 * ดึงรายการการจองทั้งหมด (รองรับ pagination)
 */
exports.list = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const offset = (page - 1) * limit;

    const { rows, total } = await getBookingsPaged(limit, offset);
    res.json({
      data: rows,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("Error in GET /bookings:", err);
    res.status(500).json({ error: "ไม่สามารถดึงรายการการจองได้" });
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
      return res.status(404).json({ error: "ไม่พบการจองที่ระบุ" });
    }
    res.json(booking);
  } catch (err) {
    console.error("Error in GET /bookings/:id:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดขณะดึงการจอง" });
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
    console.error("Error in POST /bookings:", err);
    res.status(500).json({ error: "ไม่สามารถสร้างการจองได้" });
  }
};

/**
 * PUT /api/bookings/:id
 * แก้ไขข้อมูลการจอง
 */
exports.update = async (req, res) => {
  try {
    await updateBooking(req.params.id, req.body);
    res.json({ message: "อัปเดตการจองเรียบร้อย" });
  } catch (err) {
    console.error("Error in PUT /bookings/:id:", err);
    res.status(500).json({ error: "ไม่สามารถอัปเดตการจองได้" });
  }
};

/**
 * DELETE /api/bookings/:id
 * ลบการจองตาม ID
 */
exports.remove = async (req, res) => {
  try {
    await deleteBooking(req.params.id);
    res.json({ message: "ลบการจองเรียบร้อย" });
  } catch (err) {
    console.error("Error in DELETE /bookings/:id:", err);
    res.status(500).json({ error: "ไม่สามารถลบการจองได้" });
  }
};

/**
 * POST /api/bookings/:id/approve
 * อนุมัติการจองตามขั้นตอน (Multi-Level Approval)
 */
exports.approveBooking = async (req, res) => {
  const booking_id = req.params.id;
  const user_id = req.user?.user_id;
  const { comment } = req.body;

  try {
    const booking = await getApprovalMeta(booking_id);
    if (!booking || !booking.flow_id) {
      return res
        .status(404)
        .json({ error: "ไม่พบ booking หรือยังไม่ได้กำหนด flow" });
    }

    const approvalStatus = await approvalStatusModel.getStatus(booking_id);
    if (
      !approvalStatus ||
      approvalStatus.is_approved ||
      approvalStatus.is_rejected
    ) {
      return res
        .status(400)
        .json({ error: "Booking นี้อนุมัติครบแล้วหรือถูกปฏิเสธ" });
    }

    const steps = await approvalStepModel.getStepsByFlow(booking.flow_id);
    const currentStep = steps.find(
      (s) => s.step_order === approvalStatus.current_step_order
    );
    if (!currentStep)
      return res.status(404).json({ error: "ไม่พบขั้นตอนปัจจุบัน" });

    const user = await userModel.getUserById(user_id);
    if (!user || user.role_id !== currentStep.role_id) {
      return res
        .status(403)
        .json({ error: "คุณไม่มีสิทธิ์อนุมัติในขั้นตอนนี้" });
    }

    await approvalLogModel.addLog({
      booking_id,
      step_id: currentStep.step_id,
      approved_by: user_id,
      status: "approved",
      comment: comment || null,
    });

    const nextStepOrder = currentStep.step_order + 1;
    const nextStep = steps.find((s) => s.step_order === nextStepOrder);

    if (nextStep) {
      await approvalStatusModel.nextStep(booking_id);
      res.json({
        message: `อนุมัติเรียบร้อย → ไปยังขั้นตอนที่ ${nextStepOrder}`,
      });
    } else {
      await approvalStatusModel.markApproved(booking_id);
      await updateApprovalStatus(booking_id, "approved");
      res.json({ message: "อนุมัติครบทุกขั้นตอนแล้ว" });
    }
  } catch (err) {
    console.error("Error in POST /bookings/:id/approve:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};

// controllers/bookingController.js (ส่วนเพิ่มเติมสำหรับ Reject Booking)

/**
 * POST /api/bookings/:id/reject
 * ปฏิเสธการจอง (Reject Flow)
 */
exports.rejectBooking = async (req, res) => {
  const booking_id = req.params.id;
  const user_id = req.user?.user_id;
  const { comment } = req.body;

  try {
    const booking = await getApprovalMeta(booking_id);
    if (!booking || !booking.flow_id) {
      return res
        .status(404)
        .json({ error: "ไม่พบ booking หรือยังไม่ได้กำหนด flow" });
    }

    const approvalStatus = await approvalStatusModel.getStatus(booking_id);
    if (
      !approvalStatus ||
      approvalStatus.is_approved ||
      approvalStatus.is_rejected
    ) {
      return res
        .status(400)
        .json({ error: "Booking นี้อนุมัติครบแล้วหรือถูกปฏิเสธไปแล้ว" });
    }

    const steps = await approvalStepModel.getStepsByFlow(booking.flow_id);
    const currentStep = steps.find(
      (s) => s.step_order === approvalStatus.current_step_order
    );
    if (!currentStep)
      return res.status(404).json({ error: "ไม่พบขั้นตอนปัจจุบัน" });

    const user = await userModel.getUserById(user_id);
    if (!user || user.role_id !== currentStep.role_id) {
      return res
        .status(403)
        .json({ error: "คุณไม่มีสิทธิ์ปฏิเสธในขั้นตอนนี้" });
    }

    await approvalLogModel.addLog({
      booking_id,
      step_id: currentStep.step_id,
      approved_by: user_id,
      status: "rejected",
      comment: comment || null,
    });

    await approvalStatusModel.markRejected(booking_id);
    await updateApprovalStatus(booking_id, "rejected");

    res.json({ message: "ปฏิเสธการจองเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Error in POST /bookings/:id/reject:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};
