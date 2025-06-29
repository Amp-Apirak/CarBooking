// models/bookingModel.js
// ฟังก์ชันติดต่อฐานข้อมูลสำหรับ Booking Workflow

const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

/**
 * ดึงรายการ booking พร้อม pagination
 */
async function getBookingsPaged(limit, offset, accessibleOrgIds = []) {
  if (!accessibleOrgIds.length) {
    return { rows: [], total: 0 };
  }

  const placeholder = accessibleOrgIds.map(() => '?').join(',');

  const sql = `
    SELECT b.*, u.username, o.name as organization_name
    FROM bookings b
    JOIN users u ON b.user_id = u.user_id
    JOIN organizations o ON u.organization_id = o.organization_id
    WHERE u.organization_id IN (${placeholder})
    ORDER BY b.created_at DESC
    LIMIT ? OFFSET ?
  `;

  const countSql = `
    SELECT COUNT(b.booking_id) AS total
    FROM bookings b
    JOIN users u ON b.user_id = u.user_id
    WHERE u.organization_id IN (${placeholder})
  `;

  const params = [...accessibleOrgIds, limit, offset];
  const countParams = [...accessibleOrgIds];

  const [rows] = await db.query(sql, params);
  const [[{ total }]] = await db.query(countSql, countParams);

  return { rows, total };
}

/**
 * ดึงรายละเอียด booking ตาม ID
 */
async function getBookingById(bookingId) {
  const [rows] = await db.query(
    `SELECT * FROM bookings WHERE booking_id = ? LIMIT 1`,
    [bookingId]
  );
  return rows[0] || null;
}

/**
 * สร้าง booking ใหม่ (รวมคอลัมน์ status)
 */
async function createBooking(data) {
  const id = uuidv4().replace(/-/g, "");
  const sql = `INSERT INTO bookings (
      booking_id, user_id, vehicle_id, driver_id,
      num_passengers, reason, phone,
      start_date, start_time, end_date, end_time,
      origin_location, destination_location,
      start_odometer, end_odometer, total_distance, status, flow_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const totalDistance = data.end_odometer - data.start_odometer;
  const params = [
    id,
    data.user_id,
    data.vehicle_id,
    data.driver_id || null,
    data.num_passengers,
    data.reason,
    data.phone,
    data.start_date,
    data.start_time,
    data.end_date,
    data.end_time,
    data.origin_location,
    data.destination_location,
    data.start_odometer,
    data.end_odometer,
    totalDistance,
    data.status || "pending",
    data.flow_id || null,
  ];
  await db.query(sql, params);
  return id;
}

/**
 * แก้ไข booking ตาม ID
 */
async function updateBooking(bookingId, data) {
  const fields = [];
  const params = [];
  for (const key of [
    "num_passengers",
    "reason",
    "phone",
    "start_date",
    "start_time",
    "end_date",
    "end_time",
    "origin_location",
    "destination_location",
    "start_odometer",
    "end_odometer",
    "status",
  ]) {
    if (data[key] !== undefined) {
      if (key === "end_odometer" && data.start_odometer !== undefined) {
        fields.push(`total_distance = ?`);
        params.push(data.end_odometer - data.start_odometer);
      }
      fields.push(`${key} = ?`);
      params.push(data[key]);
    }
  }
  if (!fields.length) return;
  const sql = `UPDATE bookings SET ${fields.join(", ")} WHERE booking_id = ?`;
  params.push(bookingId);
  await db.query(sql, params);
}

/**
 * ลบ booking ตาม ID
 */
async function deleteBooking(bookingId) {
  await db.query(`DELETE FROM bookings WHERE booking_id = ?`, [bookingId]);
}

// ดึง flow_id และ approval_status ของ booking
async function getApprovalMeta(booking_id) {
  const [rows] = await db.query(
    `SELECT flow_id, approval_status FROM bookings WHERE booking_id = ?`,
    [booking_id]
  );
  return rows[0];
}

// อัปเดตสถานะ booking (approved/rejected)
async function updateApprovalStatus(booking_id, status) {
  await db.query(
    `UPDATE bookings SET approval_status = ? WHERE booking_id = ?`,
    [status, booking_id]
  );
}


module.exports = {
  getBookingsPaged,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getApprovalMeta,
  updateApprovalStatus,
};
