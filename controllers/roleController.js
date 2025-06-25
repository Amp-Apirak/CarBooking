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
