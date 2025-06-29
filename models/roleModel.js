// models/roleModel.js
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.getAllRoles = async () => {
  const [rows] = await db.query(`SELECT * FROM roles`);
  return rows;
};

exports.getRoleById = async (role_id) => {
  const [rows] = await db.query(`SELECT * FROM roles WHERE role_id = ?`, [
    role_id,
  ]);
  return rows[0];
};

exports.createRole = async (role) => {
  const role_id = role.role_id || uuidv4().replace(/-/g, "");
  const name = role.name;

  if (!name) throw new Error("Missing 'name' field");

  await db.query("INSERT INTO roles (role_id, name) VALUES (?, ?)", [
    role_id,
    name,
  ]);
};

exports.updateRole = async (role_id, role) => {
  const { name } = role;
  
  if (!name) throw new Error("Missing 'name' field");

  await db.query("UPDATE roles SET name = ? WHERE role_id = ?", [
    name,
    role_id,
  ]);
};

exports.deleteRole = async (role_id) => {
  await db.query("DELETE FROM roles WHERE role_id = ?", [role_id]);
};
