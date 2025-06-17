// models/userModel.js
// ฟังก์ชันติดต่อฐานข้อมูลในตาราง users

const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

/**
 * สร้างผู้ใช้ใหม่
 * @param {{ username, email, password, first_name, last_name, gender, citizen_id, phone, address, country, province, postal_code, avatar_path, department_id, status }} userData
 * @returns {Promise<string>} คืนค่า user_id ที่สร้างใหม่
 */
async function createUser(userData) {
  const userId = uuidv4().replace(/-/g, '');
  const sql = `
    INSERT INTO users (
      user_id, username, email, password,
      first_name, last_name, gender, citizen_id,
      phone, address, country, province, postal_code,
      avatar_path, department_id, status
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
    userData.department_id,
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
 * @param {object} adProfile  // ตัวอย่าง { email, first_name, last_name, phone, department }
 */
async function updateUserProfileByUsername(username, adProfile) {
  const sql = `UPDATE users
    SET email=?, first_name=?, last_name=?, phone=?, department_id=?
    WHERE username=?`;
  await db.query(sql, [
    adProfile.email,
    adProfile.first_name,
    adProfile.last_name,
    adProfile.phone,
    adProfile.department, // สมมุติ mapping department_id จาก AD ตรงๆ หรือ custom
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


module.exports = {
  createUser,
  getUserByUsername,
  getUserById,
  updateUserProfileByUsername
};
