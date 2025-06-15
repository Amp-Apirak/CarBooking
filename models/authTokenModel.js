/**
 * models/authTokenModel.js
 *  จัดการ refresh token + blacklist
 */
const db   = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

// --- สร้าง refresh token ใหม่ ---
async function createRefreshToken(user_id, days = 7) {
  const plain = uuidv4();                       // token ที่จะส่งให้ client
  const hash  = crypto.createHash('sha256').update(plain).digest('hex');
  const token_id = uuidv4();
  const expired_at = new Date(Date.now() + days * 86400000); // วันหมดอายุ

  await db.query(
    `INSERT INTO refresh_tokens (token_id, user_id, token_hash, expired_at)
     VALUES (?, ?, ?, ?)`,
    [token_id, user_id, hash, expired_at]
  );
  return plain; // คืน token (plaintext) ไปให้ client
}

// --- ตรวจ refresh token ---
async function verifyRefreshToken(plain) {
  const hash = crypto.createHash('sha256').update(plain).digest('hex');
  const [rows] = await db.query(
    `SELECT * FROM refresh_tokens
     WHERE token_hash = ? AND revoked_at IS NULL AND expired_at > NOW()
     LIMIT 1`,
    [hash]
  );
  return rows[0] || null;
}

// --- เพิกถอน refresh token (logout) ---
async function revokeRefreshToken(token_id) {
  await db.query(
    `UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_id = ?`,
    [token_id]
  );
}

module.exports = { createRefreshToken, verifyRefreshToken, revokeRefreshToken };
