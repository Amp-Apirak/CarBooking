// models/userModel.js
// ฟังก์ชันติดต่อฐานข้อมูลในตาราง users

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * สร้างผู้ใช้ใหม่
 * @param {{ username, email, password, first_name, last_name, gender, citizen_id, phone, address, country, province, postal_code, avatar_path, organization_id, status }} userData
 * @returns {Promise<string>} คืนค่า user_id ที่สร้างใหม่
 */
async function createUser(userData) {
  const userId = uuidv4().replace(/-/g, '');
  const sql = `
    INSERT INTO users (
      user_id, username, email, password,
      first_name, last_name, gender, citizen_id,
      phone, address, country, province, postal_code,
      avatar_path, organization_id, status
    ) VALUES (
      ?, ?, ?, ?,
      ?, ?, ?, ?,
      ?, ?, ?, ?, ?,
      ?, ?, ?
    )
  `;
  const params = [
    userId,
    userData.username,
    userData.email,
    userData.password,      // ควรเป็น hash แล้ว
    userData.first_name,
    userData.last_name,
    userData.gender,
    userData.citizen_id,
    userData.phone,
    userData.address,
    userData.country,
    userData.province,
    userData.postal_code,
    userData.avatar_path,
    userData.organization_id,
    userData.status || 'active'
  ];
  await db.query(sql, params);
  return userId;
}

/**
 * ดึงข้อมูลผู้ใช้ตาม username
 * @param {string} username
 * @returns {Promise<Object|null>} คืนค่า row หรือ null
 */
async function getUserByUsername(username) {
  const sql = `SELECT * FROM users WHERE username = ? LIMIT 1`;
  const [rows] = await db.query(sql, [username]);
  return rows[0] || null;
}

/**
 * ดึงข้อมูลผู้ใช้ตาม user_id
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function getUserById(userId) {
  const sql = `SELECT * FROM users WHERE user_id = ? LIMIT 1`;
  const [rows] = await db.query(sql, [userId]);
  return rows[0] || null;
}

/**
 * อัปเดตข้อมูลผู้ใช้ (Sync AD) ตาม username (สอดคล้องกับ sAMAccountName)
 * @param {string} username
 * @param {object} adProfile  // ตัวอย่าง { email, first_name, last_name, phone, organization }
 */
async function updateUserProfileByUsername(username, adProfile) {
  const sql = `UPDATE users
    SET email=?, first_name=?, last_name=?, phone=?, organization_id=?
    WHERE username=?`;
  await db.query(sql, [
    adProfile.email,
    adProfile.first_name,
    adProfile.last_name,
    adProfile.phone,
    adProfile.organization, // สมมุติ mapping organization_id จาก AD ตรงๆ หรือ custom
    username
  ]);

  const params = [
    adProfile.givenName,
    adProfile.sn,
    adProfile.mail,
    username,
  ];
  await db.query(sql, params);
}

/**
 * ดึงรายการผู้ใช้ทั้งหมด (สำหรับ admin)
 * @param {Object} options - ตัวเลือกการกรอง
 * @returns {Promise<Array>} รายการผู้ใช้
 */
async function getAllUsers(options = {}) {
  let sql = `
    SELECT 
      u.user_id, u.username, u.email, u.first_name, u.last_name, 
      u.gender, u.citizen_id, u.phone, u.address, u.country, 
      u.province, u.postal_code, u.avatar_path, u.organization_id, 
      u.status, u.created_at, u.updated_at,
      org.organization_name
    FROM users u
    LEFT JOIN organizations org ON u.organization_id = org.organization_id
  `;
  
  const conditions = [];
  const params = [];
  
  if (options.status) {
    conditions.push('u.status = ?');
    params.push(options.status);
  }
  
  if (options.organization_id) {
    conditions.push('u.organization_id = ?');
    params.push(options.organization_id);
  }
  
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  
  sql += ' ORDER BY u.created_at DESC';
  
  if (options.limit) {
    sql += ' LIMIT ?';
    params.push(parseInt(options.limit));
    
    if (options.offset) {
      sql += ' OFFSET ?';
      params.push(parseInt(options.offset));
    }
  }
  
  const [rows] = await db.query(sql, params);
  return rows;
}

/**
 * อัปเดตโปรไฟล์ผู้ใช้
 * @param {string} userId รหัสผู้ใช้
 * @param {Object} profileData ข้อมูลโปรไฟล์ที่ต้องการอัปเดต
 * @returns {Promise<Object|null>} ข้อมูลผู้ใช้ที่อัปเดตแล้ว
 */
async function updateUserProfile(userId, profileData) {
  const {
    first_name,
    last_name,
    gender,
    citizen_id,
    phone,
    address,
    country,
    province,
    postal_code
  } = profileData;
  
  const sql = `
    UPDATE users 
    SET 
      first_name = ?,
      last_name = ?,
      gender = ?,
      citizen_id = ?,
      phone = ?,
      address = ?,
      country = ?,
      province = ?,
      postal_code = ?,
      updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;
  
  const params = [
    first_name,
    last_name,
    gender,
    citizen_id,
    phone,
    address,
    country,
    province,
    postal_code,
    userId
  ];
  
  const [result] = await db.query(sql, params);
  
  if (result.affectedRows === 0) {
    return null; // ไม่พบผู้ใช้
  }
  
  // ดึงข้อมูลผู้ใช้ที่อัปเดตแล้ว
  return await getUserById(userId);
}

/**
 * อัปเดต avatar ของผู้ใช้
 * @param {string} userId รหัสผู้ใช้
 * @param {string} avatarPath พาธไฟล์ avatar
 * @returns {Promise<boolean>} true ถ้าอัปเดตสำเร็จ
 */
async function updateUserAvatar(userId, avatarPath) {
  const sql = `
    UPDATE users 
    SET avatar_path = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;
  
  const [result] = await db.query(sql, [avatarPath, userId]);
  return result.affectedRows > 0;
}

/**
 * อัปเดตสถานะผู้ใช้
 * @param {string} userId รหัสผู้ใช้
 * @param {string} status สถานะใหม่
 * @returns {Promise<boolean>} true ถ้าอัปเดตสำเร็จ
 */
async function updateUserStatus(userId, status) {
  const sql = `
    UPDATE users 
    SET status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;
  
  const [result] = await db.query(sql, [status, userId]);
  return result.affectedRows > 0;
}

/**
 * เปลี่ยนรหัสผ่านผู้ใช้
 * @param {string} userId รหัสผู้ใช้
 * @param {string} hashedPassword รหัสผ่านที่ hash แล้ว
 * @returns {Promise<boolean>} true ถ้าเปลี่ยนสำเร็จ
 */
async function changeUserPassword(userId, hashedPassword) {
  const sql = `
    UPDATE users 
    SET password = ?, updated_at = CURRENT_TIMESTAMP
    WHERE user_id = ?
  `;
  
  const [result] = await db.query(sql, [hashedPassword, userId]);
  return result.affectedRows > 0;
}

/**
 * ค้นหาผู้ใช้
 * @param {string} searchTerm คำค้นหา
 * @param {Object} options ตัวเลือกการค้นหา
 * @returns {Promise<Array>} รายการผู้ใช้ที่พบ
 */
async function searchUsers(searchTerm, options = {}) {
  let sql = `
    SELECT 
      u.user_id, u.username, u.email, u.first_name, u.last_name, 
      u.phone, u.organization_id, u.status, u.created_at,
      org.organization_name
    FROM users u
    LEFT JOIN organizations org ON u.organization_id = org.organization_id
    WHERE (
      u.username LIKE ? OR 
      u.email LIKE ? OR 
      u.first_name LIKE ? OR 
      u.last_name LIKE ? OR
      CONCAT(u.first_name, ' ', u.last_name) LIKE ?
    )
  `;
  
  const searchPattern = `%${searchTerm}%`;
  const params = [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern];
  
  if (options.organization_id) {
    sql += ' AND u.organization_id = ?';
    params.push(options.organization_id);
  }
  
  if (options.status) {
    sql += ' AND u.status = ?';
    params.push(options.status);
  }
  
  sql += ' ORDER BY u.first_name, u.last_name LIMIT 50';
  
  const [rows] = await db.query(sql, params);
  return rows;
}

/**
 * นับจำนวนผู้ใช้ทั้งหมด
 * @param {Object} filters ตัวกรองสำหรับนับ
 * @returns {Promise<number>} จำนวนผู้ใช้
 */
async function countUsers(filters = {}) {
  let sql = 'SELECT COUNT(*) as total FROM users';
  const conditions = [];
  const params = [];
  
  if (filters.status) {
    conditions.push('status = ?');
    params.push(filters.status);
  }
  
  if (filters.organization_id) {
    conditions.push('organization_id = ?');
    params.push(filters.organization_id);
  }
  
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  
  const [rows] = await db.query(sql, params);
  return rows[0].total;
}

module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  updateUserProfileByUsername,
  getAllUsers,
  updateUserProfile,
  updateUserAvatar,
  updateUserStatus,
  changeUserPassword,
  searchUsers,
  countUsers
};
