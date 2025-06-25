// models/bookingApprovalStatusModel.js
const db = require('../config/db');

// สร้างสถานะ approval เริ่มต้น
async function initStatus(booking_id, flow_id) {
  await db.query(
    `INSERT INTO booking_approval_status (booking_id, flow_id, current_step_order)
     VALUES (?, ?, 1)`,
    [booking_id, flow_id]
  );
}

// ดึงสถานะปัจจุบันของ booking
async function getStatus(booking_id) {
  const [rows] = await db.query(
    `SELECT * FROM booking_approval_status WHERE booking_id = ?`,
    [booking_id]
  );
  return rows[0];
}

// อัปเดตไป step ถัดไป
async function nextStep(booking_id) {
  await db.query(
    `UPDATE booking_approval_status
     SET current_step_order = current_step_order + 1
     WHERE booking_id = ?`,
    [booking_id]
  );
}

// ทำเครื่องหมายว่า booking ผ่านการอนุมัติสมบูรณ์
async function markApproved(booking_id) {
  await db.query(
    `UPDATE booking_approval_status
     SET is_approved = TRUE
     WHERE booking_id = ?`,
    [booking_id]
  );
}

// ทำเครื่องหมายว่า booking ถูก reject
async function markRejected(booking_id) {
  await db.query(
    `UPDATE booking_approval_status
     SET is_rejected = TRUE
     WHERE booking_id = ?`,
    [booking_id]
  );
}

module.exports = {
  initStatus,
  getStatus,
  nextStep,
  markApproved,
  markRejected
};
