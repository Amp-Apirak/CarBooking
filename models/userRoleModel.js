// models/userRoleModel.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // ผูก Role ให้ User
  async assignRole(user_id, role_id) {
    const user_role_id = uuidv4().replace(/-/g,'');
    await db.query(
      'INSERT INTO user_roles(user_role_id,user_id,role_id,created_at) VALUES(?,?,?,NOW())',
      [user_role_id, user_id, role_id]
    );
    return user_role_id;
  },

  // ลบ Role ออกจาก User
  async removeRole(user_role_id) {
    await db.query(
      'DELETE FROM user_roles WHERE user_role_id = ?',
      [user_role_id]
    );
  },

  // ดึง Role ที่ผูกกับ User
  async getRolesByUser(user_id) {
    const [rows] = await db.query(
      `SELECT ur.user_role_id, r.role_id, r.name
         FROM user_roles ur
         JOIN roles r ON ur.role_id = r.role_id
        WHERE ur.user_id = ?`,
      [user_id]
    );
    return rows;
  }
};
