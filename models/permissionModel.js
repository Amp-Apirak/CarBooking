// models/permissionModel.js
const db = require('../config/db');

exports.getAllPermissions = async () => {
  const [rows] = await db.query('SELECT * FROM permissions');
  return rows;
};

exports.createPermission = async (permission) => {
  const { permission_id, name, description } = permission;
  await db.query(
    'INSERT INTO permissions (permission_id, name, description) VALUES (?, ?, ?)',
    [permission_id, name, description]
  );
};

exports.getPermissionById = async (permission_id) => {
  const [rows] = await db.query('SELECT * FROM permissions WHERE permission_id = ?', [permission_id]);
  return rows[0];
};

exports.updatePermission = async (permission_id, permission) => {
  const { name, description } = permission;
  await db.query(
    'UPDATE permissions SET name = ?, description = ? WHERE permission_id = ?',
    [name, description, permission_id]
  );
};

exports.deletePermission = async (permission_id) => {
  await db.query('DELETE FROM permissions WHERE permission_id = ?', [permission_id]);
};
