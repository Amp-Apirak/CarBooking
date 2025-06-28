
// models/rolePermissionModel.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

exports.getPermissionsByRole = async (role_id) => {
  const [rows] = await db.query(
    `SELECT p.* FROM role_permissions rp
     JOIN permissions p ON rp.permission_id = p.permission_id
     WHERE rp.role_id = ?`,
    [role_id]
  );
  return rows;
};

exports.assignPermissionToRole = async (role_id, permission_id) => {
  const role_permission_id = uuidv4().replace(/-/g, '');
  await db.query(`INSERT INTO role_permissions (role_permission_id, role_id, permission_id) VALUES (?, ?, ?)`, [role_permission_id, role_id, permission_id]);
};

exports.removePermissionFromRole = async (role_id, permission_id) => {
  await db.query(`DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?`, [role_id, permission_id]); 
};
