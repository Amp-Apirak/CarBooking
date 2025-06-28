// models/approvalFlowModel.js
// ฟังก์ชันติดต่อกับตาราง approval_flows ในฐานข้อมูล

const db = require("../config/db"); // เรียกใช้ connection กับฐานข้อมูล
const { v4: uuidv4 } = require("uuid"); // ใช้สร้าง UUID สำหรับรหัส flow_id

/** สร้าง Flow ใหม่ */
async function createFlow(flow_name, flow_description) {
  const flow_id = uuidv4().replace(/-/g, ""); // สร้าง UUID และลบเครื่องหมาย -
  await db.query(
    `INSERT INTO approval_flows (flow_id, flow_name, flow_description) VALUES (?, ?, ?)`,
    [flow_id, flow_name, flow_description]
  );
  return flow_id; // ส่งกลับรหัส flow ที่สร้างใหม่
}

/** ดึง Flow ทั้งหมด และ Page */
async function getAllFlows(limit, offset) {
  const [rows] = await db.query(
    `SELECT * FROM approval_flows ORDER BY flow_name ASC LIMIT ? OFFSET ?`,
    [limit, offset]
  );
  const [[{ total }]] = await db.query(
    `SELECT COUNT(*) AS total FROM approval_flows`
  );
  return { rows, total };
}

/** ดึง Flow รายการเดียวจาก ID */
async function getFlowById(flow_id) {
  const [rows] = await db.query(
    `SELECT * FROM approval_flows WHERE flow_id = ?`,
    [flow_id]
  );
  return rows[0];
}

/** แก้ไขข้อมูล Flow */
async function updateFlow(flow_id, flow_name, flow_description) {
  await db.query(
    `UPDATE approval_flows SET flow_name = ?, flow_description = ? WHERE flow_id = ?`,
    [flow_name, flow_description, flow_id]
  );
}

/** ปิดใช้งาน Flow */
async function deactivateFlow(flow_id) {
  await db.query(
    `UPDATE approval_flows SET is_active = FALSE WHERE flow_id = ?`,
    [flow_id]
  );
}

/** เปิดใช้งาน Flow */
async function activateFlow(flow_id) {
  await db.query(
    `UPDATE approval_flows SET is_active = TRUE WHERE flow_id = ?`,
    [flow_id]
  );
}

/** ลบ Flow */
async function deleteFlow(flow_id) {
  await db.query(`DELETE FROM approval_flows WHERE flow_id = ?`, [flow_id]);
}

module.exports = {
  createFlow,
  getAllFlows,
  getFlowById,
  updateFlow,
  deactivateFlow,
  activateFlow,
  deleteFlow,
};
