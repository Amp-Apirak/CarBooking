// controllers/approvalStepController.js
// ควบคุมการทำงานของ approval_steps

const {
  createStep,
  getStepsByFlow,
  deleteStepsByFlow,
  getStepById,
  updateStep,
  deleteStep,
} = require("../models/approvalStepModel");

/** เพิ่มขั้นตอนใหม่ใน flow */
exports.createStep = async (req, res) => {
  const { flow_id } = req.params;
  const { step_order, role_id, step_name } = req.body;

  if (!step_order || !role_id || !step_name) {
    return res
      .status(400)
      .json({ error: "กรุณาระบุ step_order, role_id และ step_name" });
  }

  try {
    const step_id = await createStep(flow_id, step_order, role_id, step_name);
    res.status(201).json({ message: "เพิ่มขั้นตอนสำเร็จ", step_id });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};

/** ดึงขั้นตอนทั้งหมดของ flow */
exports.getStepsByFlow = async (req, res) => {
  const { flow_id } = req.params;

  try {
    const steps = await getStepsByFlow(flow_id);
    res.json(steps);
  } catch (err) {
    res
      .status(500)
      .json({ error: "ไม่สามารถดึงขั้นตอนได้", detail: err.message });
  }
};

/** ลบทุกขั้นของ flow (ใช้ตอนลบ flow) */
exports.deleteStepsByFlow = async (req, res) => {
  const { flow_id } = req.params;

  try {
    await deleteStepsByFlow(flow_id);
    res.json({ message: "ลบขั้นตอนทั้งหมดของ flow แล้ว" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};

/** แก้ไขขั้นตอนเดียว */
exports.updateStep = async (req, res) => {
  const { flow_id, stepId } = req.params;
  const { step_order, role_id, step_name } = req.body;

  if (!step_order || !role_id || !step_name) {
    return res
      .status(400)
      .json({ error: "กรุณาระบุ step_order, role_id และ step_name" });
  }

  try {
    // ตรวจสอบว่าขั้นตอนมีอยู่จริง
    const existingStep = await getStepById(stepId);
    if (!existingStep) {
      return res.status(404).json({ error: "ไม่พบขั้นตอนที่ระบุ" });
    }

    // ตรวจสอบว่าขั้นตอนอยู่ใน flow ที่ถูกต้อง
    if (existingStep.flow_id !== flow_id) {
      return res.status(400).json({ error: "ขั้นตอนไม่อยู่ใน flow ที่ระบุ" });
    }

    await updateStep(stepId, step_order, role_id, step_name);
    res.json({ message: "แก้ไขขั้นตอนสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};

/** ลบขั้นตอนเดียว */
exports.deleteStep = async (req, res) => {
  const { flow_id, stepId } = req.params;

  try {
    // ตรวจสอบว่าขั้นตอนมีอยู่จริง
    const existingStep = await getStepById(stepId);
    if (!existingStep) {
      return res.status(404).json({ error: "ไม่พบขั้นตอนที่ระบุ" });
    }

    // ตรวจสอบว่าขั้นตอนอยู่ใน flow ที่ถูกต้อง
    if (existingStep.flow_id !== flow_id) {
      return res.status(400).json({ error: "ขั้นตอนไม่อยู่ใน flow ที่ระบุ" });
    }

    await deleteStep(stepId);
    res.json({ message: "ลบขั้นตอนสำเร็จ" });
  } catch (err) {
    res.status(500).json({ error: "เกิดข้อผิดพลาด", detail: err.message });
  }
};
