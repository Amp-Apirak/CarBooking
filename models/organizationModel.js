// models/organizationModel.js
const db = require("../config/db");

/**
 * ดึงรายการองค์กรทั้งหมด
 */
async function getAllOrganizations() {
  const [rows] = await db.query(
    "SELECT organization_id, parent_id, path, name, created_at FROM organizations ORDER BY path, name"
  );
  return rows;
}

/**
 * ดึงองค์กรตาม ID
 * @param {string} id
 */
async function getOrganizationById(id) {
  const [rows] = await db.query(
    "SELECT organization_id, parent_id, path, name, created_at FROM organizations WHERE organization_id = ?",
    [id]
  );
  return rows[0];
}

/**
 * สร้างองค์กรใหม่
 * @param {string} name
 * @param {string} parent_id - ID ขององค์กรแม่ (optional)
 * @returns {string} ID ขององค์กรที่สร้าง
 */
async function createOrganization(name, parent_id = null) {
  // สร้าง UUID ในฝั่ง MySQL แล้วดึงมาใช้
  const [[{ id }]] = await db.query("SELECT REPLACE(UUID(),'-','') AS id");

  let path = id; // Default path เป็น id ของตัวเอง

  if (parent_id) {
    // ดึง path ของ parent
    const [parentRows] = await db.query(
      "SELECT path FROM organizations WHERE organization_id = ?",
      [parent_id]
    );
    if (parentRows.length > 0) {
      path = `${parentRows[0].path}/${id}`;
    }
  }

  await db.query(
    "INSERT INTO organizations (organization_id, parent_id, path, name) VALUES (?, ?, ?, ?)",
    [id, parent_id, path, name]
  );
  return id;
}

/**
 * แก้ไขข้อมูลองค์กร
 * @param {string} id
 * @param {object} data - { name, parent_id }
 */
async function updateOrganization(id, data) {
  const fields = [];
  const params = [];

  if (data.name !== undefined) {
    fields.push('name = ?');
    params.push(data.name);
  }

  if (data.parent_id !== undefined) {
    fields.push('parent_id = ?');
    params.push(data.parent_id);

    // อัปเดต path ใหม่
    let newPath = id;
    if (data.parent_id) {
      const [parentRows] = await db.query(
        "SELECT path FROM organizations WHERE organization_id = ?",
        [data.parent_id]
      );
      if (parentRows.length > 0) {
        newPath = `${parentRows[0].path}/${id}`;
      }
    }
    fields.push('path = ?');
    params.push(newPath);
  }

  if (fields.length > 0) {
    params.push(id);
    await db.query(
      `UPDATE organizations SET ${fields.join(', ')} WHERE organization_id = ?`,
      params
    );
  }
}

/**
 * ลบองค์กร
 * @param {string} id
 */
async function deleteOrganization(id) {
  await db.query("DELETE FROM organizations WHERE organization_id = ?", [id]);
}

/**
 * ดึงองค์กรลูกทั้งหมดของ parent_id
 * @param {string} parent_id
 */
async function getChildOrganizations(parent_id) {
  const [rows] = await db.query(
    "SELECT organization_id, parent_id, path, name, created_at FROM organizations WHERE parent_id = ? ORDER BY name",
    [parent_id]
  );
  return rows;
}

/**
 * ดึงองค์กรทั้งหมดที่อยู่ใต้ path (รวมลูกหลาน)
 * @param {string} organization_id
 */
async function getOrganizationHierarchy(organization_id) {
  const [rows] = await db.query(
    "SELECT organization_id, parent_id, path, name, created_at FROM organizations WHERE path LIKE CONCAT((SELECT path FROM organizations WHERE organization_id = ?), '%') ORDER BY path",
    [organization_id]
  );
  return rows;
}

/**
 * ดึงรายการองค์กรที่ user สามารถเข้าถึงได้
 * @param {string} user_id
 */
async function getUserAccessibleOrganizations(user_id) {
  const [rows] = await db.query(`
    SELECT DISTINCT o.organization_id, o.parent_id, o.path, o.name, o.created_at
    FROM organizations o
    WHERE o.organization_id = (SELECT organization_id FROM users WHERE user_id = ?)
    OR o.organization_id IN (SELECT organization_id FROM user_allowed_orgs WHERE user_id = ?)
    ORDER BY o.path, o.name
  `, [user_id, user_id]);
  return rows;
}

/**
 * เพิ่มสิทธิ์ให้ user เข้าถึงองค์กรอื่น
 * @param {string} user_id
 * @param {string} organization_id
 * @param {string} granted_by - user_id ของผู้ให้สิทธิ์
 */
async function grantOrganizationAccess(user_id, organization_id, granted_by) {
  const [[{ id }]] = await db.query("SELECT REPLACE(UUID(),'-','') AS id");
  await db.query(
    "INSERT INTO user_allowed_orgs (id, user_id, organization_id, granted_by) VALUES (?, ?, ?, ?)",
    [id, user_id, organization_id, granted_by]
  );
}

/**
 * ยกเลิกสิทธิ์การเข้าถึงองค์กร
 * @param {string} user_id
 * @param {string} organization_id
 */
async function revokeOrganizationAccess(user_id, organization_id) {
  await db.query(
    "DELETE FROM user_allowed_orgs WHERE user_id = ? AND organization_id = ?",
    [user_id, organization_id]
  );
}

/**
 * ตรวจสอบว่า user มีสิทธิ์เข้าถึงองค์กรหรือไม่
 * @param {string} user_id
 * @param {string} organization_id
 */
async function checkOrganizationAccess(user_id, organization_id) {
  const [rows] = await db.query(`
    SELECT 1 FROM users WHERE user_id = ? AND organization_id = ?
    UNION
    SELECT 1 FROM user_allowed_orgs WHERE user_id = ? AND organization_id = ?
    LIMIT 1
  `, [user_id, organization_id, user_id, organization_id]);
  return rows.length > 0;
}

module.exports = {
  getAllOrganizations,
  getOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  getChildOrganizations,
  getOrganizationHierarchy,
  getUserAccessibleOrganizations,
  grantOrganizationAccess,
  revokeOrganizationAccess,
  checkOrganizationAccess,
};
