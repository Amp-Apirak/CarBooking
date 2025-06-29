// controllers/permissionController.js
const permissionModel = require("../models/permissionModel");
const { v4: uuidv4 } = require("uuid");

exports.list = async (req, res) => {
  try {
    const permissions = await permissionModel.getAllPermissions();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    // Validation
    const name = req.body.name || req.body.permission_name;
    if (!name) {
      return res.status(400).json({ error: "Permission name is required" });
    }

    const perm = {
      permission_id: uuidv4().replace(/-/g, ""),
      name: name,
      description: req.body.description || null,
    };

    await permissionModel.createPermission(perm);
    res
      .status(201)
      .json({
        message: "Permission created successfully",
        permission_id: perm.permission_id,
        name: perm.name
      });
  } catch (error) {
    console.error('Error creating permission:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const permission = await permissionModel.getPermissionById(req.params.id);
    if (!permission) {
      return res.status(404).json({ error: "ไม่พบสิทธิ์ที่ระบุ" });
    }
    res.json(permission);
  } catch (error) {
    console.error('Error getting permission by ID:', error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดขณะดึงข้อมูลสิทธิ์" });
  }
};

exports.update = async (req, res) => {
  try {
    // ตรวจสอบว่าสิทธิ์มีอยู่จริง
    const existingPermission = await permissionModel.getPermissionById(req.params.id);
    if (!existingPermission) {
      return res.status(404).json({ error: "ไม่พบสิทธิ์ที่ระบุ" });
    }

    // Validation
    const name = req.body.name || req.body.permission_name;
    if (!name) {
      return res.status(400).json({ error: "Permission name is required" });
    }

    const permissionData = {
      name: name,
      description: req.body.description || existingPermission.description,
    };

    await permissionModel.updatePermission(req.params.id, permissionData);
    res.json({ message: "อัปเดตสิทธิ์เรียบร้อยแล้ว" });
  } catch (error) {
    console.error('Error updating permission:', error);
    res.status(500).json({ error: error.message || "เกิดข้อผิดพลาดขณะอัปเดตสิทธิ์" });
  }
};

exports.remove = async (req, res) => {
  try {
    // ตรวจสอบว่าสิทธิ์มีอยู่จริง
    const existingPermission = await permissionModel.getPermissionById(req.params.id);
    if (!existingPermission) {
      return res.status(404).json({ error: "ไม่พบสิทธิ์ที่ระบุ" });
    }

    await permissionModel.deletePermission(req.params.id);
    res.json({ message: "ลบสิทธิ์เรียบร้อยแล้ว" });
  } catch (error) {
    console.error('Error deleting permission:', error);
    res.status(500).json({ error: "เกิดข้อผิดพลาดขณะลบสิทธิ์" });
  }
};
