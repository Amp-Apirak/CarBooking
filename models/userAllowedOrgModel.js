// models/userAllowedOrgModel.js
const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  // มอบสิทธิ์ดู Org ให้กับ User
  async assignOrg(user_id, organization_id, granted_by) {
    const id = uuidv4().replace(/-/g, "");
    await db.query(
      `INSERT INTO user_allowed_orgs(id,user_id,organization_id,granted_by,created_at)
       VALUES(?,?,?,?,NOW())`,
      [id, user_id, organization_id, granted_by]
    );
    return id;
  },

  // ถอนสิทธิ์ดู Org
  async removeOrg(id) {
    await db.query("DELETE FROM user_allowed_orgs WHERE id = ?", [id]);
  },

  // ดึง Org ที่ User ดูได้
  async getAllowedOrgs(user_id) {
    const [rows] = await db.query(
      `SELECT ua.id, o.organization_id, o.name, ua.granted_by
         FROM user_allowed_orgs ua
         JOIN organizations o ON ua.organization_id = o.organization_id
        WHERE ua.user_id = ?`,
      [user_id]
    );
    return rows;
  },
};
