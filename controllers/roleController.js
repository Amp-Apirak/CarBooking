// controllers/roleController.js
const roleModel = require('../models/roleModel');
const { v4: uuidv4 } = require("uuid");

exports.listRoles = async (req, res) => {
  const roles = await roleModel.getAllRoles();
  res.json(roles);
};

exports.create = async (req, res) => {
  try {
    console.log("BODY:", req.body); // ✅ ตรวจสอบว่าค่ามาไหม
    await roleModel.createRole(req.body);
    res.status(201).json({ message: "สร้างบทบาทเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Error in POST /roles:", err);
    res
      .status(500)
      .json({ error: err.message || "เกิดข้อผิดพลาดขณะสร้างบทบาท" });
  }
};

exports.getById = async (req, res) => {
  try {
    const role = await roleModel.getRoleById(req.params.id);
    if (!role) {
      return res.status(404).json({ error: "ไม่พบบทบาทที่ระบุ" });
    }
    res.json(role);
  } catch (err) {
    console.error("Error in GET /roles/:id:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดขณะดึงข้อมูลบทบาท" });
  }
};

exports.update = async (req, res) => {
  try {
    // ตรวจสอบว่าบทบาทมีอยู่จริง
    const existingRole = await roleModel.getRoleById(req.params.id);
    if (!existingRole) {
      return res.status(404).json({ error: "ไม่พบบทบาทที่ระบุ" });
    }

    await roleModel.updateRole(req.params.id, req.body);
    res.json({ message: "อัปเดตบทบาทเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Error in PUT /roles/:id:", err);
    res.status(500).json({ error: err.message || "เกิดข้อผิดพลาดขณะอัปเดตบทบาท" });
  }
};

exports.remove = async (req, res) => {
  try {
    // ตรวจสอบว่าบทบาทมีอยู่จริง
    const existingRole = await roleModel.getRoleById(req.params.id);
    if (!existingRole) {
      return res.status(404).json({ error: "ไม่พบบทบาทที่ระบุ" });
    }

    await roleModel.deleteRole(req.params.id);
    res.json({ message: "ลบบทบาทเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("Error in DELETE /roles/:id:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดขณะลบบทบาท" });
  }
};
