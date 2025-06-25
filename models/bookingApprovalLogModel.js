// models/bookingApprovalLogModel.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// เพิ่ม log การอนุมัติ
async function addLog({ booking_id, step_id, approved_by, status, comment }) {
  const log_id = uuidv4().replace(/-/g, '');
  await db.query(
    `INSERT INTO booking_approval_logs (log_id, booking_id, step_id, approved_by, status, comment)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [log_id, booking_id, step_id, approved_by, status, comment]
  );
  return log_id;
}

// ดึง log ทั้งหมดของ booking
async function getLogsByBooking(booking_id) {
  const [rows] = await db.query(
    `SELECT l.*, u.name AS approver_name, s.step_order, s.step_name
     FROM booking_approval_logs l
     JOIN users u ON l.approved_by = u.user_id
     JOIN approval_steps s ON l.step_id = s.step_id
     WHERE l.booking_id = ?
     ORDER BY s.step_order ASC`,
    [booking_id]
  );
  return rows;
}

module.exports = {
  addLog,
  getLogsByBooking
};
