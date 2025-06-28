const rolePermModel = require("../models/rolePermissionModel");

exports.getPermissionsByRole = async (req, res) => {
  const permissions = await rolePermModel.getPermissionsByRole(
    req.params.role_id
  );
  res.json(permissions);
};

exports.assignPermission = async (req, res) => {
  await rolePermModel.assignPermissionToRole(
    req.body.role_id,
    req.body.permission_id
  );
  res.json({ message: "Permission assigned to role" });
};

exports.removePermission = async (req, res) => {
  await rolePermModel.removePermissionFromRole(
    req.body.role_id,
    req.body.permission_id
  );
  res.json({ message: "Permission removed from role" });
};
