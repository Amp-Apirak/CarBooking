// controllers/userRoleController.js
const userRoleModel = require("../models/userRoleModel");

exports.assignRole = async (req, res) => {
  const { user_id, role_id } = req.body;
  if (!user_id || !role_id) {
    return res.status(400).json({ error: "ต้องระบุ user_id และ role_id" });
  }
  try {
    const id = await userRoleModel.assignRole(user_id, role_id);
    res.status(201).json({ user_role_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ไม่สามารถมอบบทบาทให้ผู้ใช้ได้" });
  }
};

exports.removeRole = async (req, res) => {
  const { user_role_id } = req.body;
  if (!user_role_id) {
    return res.status(400).json({ error: "ต้องระบุ user_role_id" });
  }
  try {
    await userRoleModel.removeRole(user_role_id);
    res.json({ message: "ลบบทบาทออกจากผู้ใช้เรียบร้อยแล้ว" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ไม่สามารถลบบทบาทออกได้" });
  }
};

exports.listRolesByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const rows = await userRoleModel.getRolesByUser(user_id);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "ไม่สามารถดึงข้อมูลบทบาทของผู้ใช้ได้" });
  }
};
