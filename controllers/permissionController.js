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
