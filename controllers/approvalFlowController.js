// controllers/approvalFlowController.js
// ควบคุมการทำงานกับ approval_flows

const {
  createFlow,
  getAllFlows,
  getFlowById,
  deactivateFlow,
  activateFlow,
  deleteFlow,
} = require("../models/approvalFlowModel");

/** สร้าง Flow ใหม่ */
exports.createFlow = async (req, res) => {
  const { flow_name, flow_description } = req.body;

  if (!flow_name || !flow_description) {
    return res.status(400).json({ error: "กรุณาระบุชื่อและคำอธิบาย Flow" });
  }

  try {
    const flow_id = await createFlow(flow_name, flow_description);
    res.status(201).json({ message: "สร้าง Flow สำเร็จ", flow_id });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};

/** ดึง Flow ทั้งหมด และ Page */
exports.getAllFlows = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const { rows, total } = await getAllFlows(limit, offset);
    const totalPages = Math.ceil(total / limit);
    res.json({ rows, total, totalPages });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};

/** แก้ไข Flow */
exports.updateFlow = async (req, res) => {
  const { id } = req.params;
  const { flow_name, flow_description } = req.body;

  if (!flow_name || !flow_description) {
    return res.status(400).json({ error: "กรุณาระบุชื่อและคำอธิบาย Flow" });
  }

  try {
    await updateFlow(id, flow_name, flow_description);
    res.json({ message: "แก้ไขข้อมูล Flow แล้ว" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};

/** ดึง Flow เดียว */
exports.getFlowById = async (req, res) => {
  const { id } = req.params;
  try {
    const flow = await getFlowById(id);
    if (!flow) return res.status(404).json({ error: "ไม่พบ Flow" });
    res.json(flow);
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};

/** ปิดใช้งาน Flow */
exports.deactivateFlow = async (req, res) => {
  const { id } = req.params;
  try {
    await deactivateFlow(id);
    res.json({ message: "ปิดการใช้งาน Flow แล้ว" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};

/** เปิดใช้งาน Flow */
exports.activateFlow = async (req, res) => {
  const { id } = req.params;
  try {
    await activateFlow(id);
    res.json({ message: "เปิดการใช้งาน Flow แล้ว" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};

/** ลบ Flow */
exports.deleteFlow = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteFlow(id);
    res.json({ message: "ลบ Flow แล้ว" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};
