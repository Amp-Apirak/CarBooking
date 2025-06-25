const rolePermModel = require("../models/rolePermissionModel");

module.exports = (requiredPermission) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!user || !user.role_id)
      return res.status(401).json({ error: "Unauthorized" });

    const permissions = await rolePermModel.getPermissionsByRole(user.role_id);
    const allowed = permissions.some(
      (p) => p.permission_name === requiredPermission
    );

    if (!allowed) return res.status(403).json({ error: "Permission denied" });
    next();
  };
};
