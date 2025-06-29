const rolePermModel = require("../models/rolePermissionModel");
const userRoleModel = require("../models/userRoleModel");

module.exports = (requiredPermission) => {
  return async (req, res, next) => {
    const user = req.user;
    if (!user || !user.user_id) {
      return res.status(401).json({ error: "Unauthorized: Invalid user data" });
    }

    try {
      // Get all roles for the user
      const userRoles = await userRoleModel.getRolesByUser(user.user_id);
      if (!userRoles || userRoles.length === 0) {
        return res.status(403).json({ error: "Permission denied: No roles assigned" });
      }

      // Check permissions for each role
      for (const role of userRoles) {
        const permissions = await rolePermModel.getPermissionsByRole(role.role_id);
        const hasPermission = permissions.some(
          (p) => p.permission_name === requiredPermission
        );
        
        if (hasPermission) {
          return next(); // Permission granted, proceed
        }
      }

      // If no role has the required permission
      return res.status(403).json({ error: "Permission denied" });

    } catch (error) {
      console.error("Error in checkPermission middleware:", error);
      return res.status(500).json({ error: "Internal server error while checking permissions" });
    }
  };
};
