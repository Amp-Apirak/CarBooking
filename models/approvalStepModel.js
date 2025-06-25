// models/approvalStepModel.js
// ฟังก์ชันติดต่อกับตาราง approval_steps

const db = require('../config/db');           // ใช้เชื่อมต่อฐานข้อมูล
const { v4: uuidv4 } = require('uuid');       // สำหรับสร้าง UUID

/** เพิ่มขั้นตอนใน flow */
async function createStep(flow_id, step_order, role_id, step_name) {
  const step_id = uuidv4().replace(/-/g, '');
  await db.query(
    `INSERT INTO approval_steps (step_id, flow_id, step_order, role_id, step_name)
     VALUES (?, ?, ?, ?, ?)`,
    [step_id, flow_id, step_order, role_id, step_name]
  );
  return step_id;
}

/** ดึงขั้นตอนทั้งหมดของ flow */
async function getStepsByFlow(flow_id) {
  const [rows] = await db.query(
    `SELECT s.*, r.name
     FROM approval_steps s
     JOIN roles r ON s.role_id = r.role_id
     WHERE s.flow_id = ?
     ORDER BY s.step_order ASC`,
    [flow_id]
  );
  return rows;
}

/** ลบขั้นตอนทั้งหมดของ flow (ใช้ตอนลบ flow) */
async function deleteStepsByFlow(flow_id) {
  await db.query(`DELETE FROM approval_steps WHERE flow_id = ?`, [flow_id]);
}

module.exports = {
  createStep,
  getStepsByFlow,
  deleteStepsByFlow
};
