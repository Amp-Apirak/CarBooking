/**
 * controllers/authController.js
 * ควบคุมการทำงาน Authentication ทั้งหมดของระบบ
 * - สมัครสมาชิก (register)
 * - เข้าสู่ระบบ (login)
 * - ขอ access token ใหม่ (refresh)
 * - ออกจากระบบ (logout)
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../config/db');
const { createUser, getUserByUsername } = require('../models/userModel');
const {
  createRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken
} = require('../models/authTokenModel');

/* ---------- ฟังก์ชันช่วยสร้าง Access Token (อายุ 15 นาที) ---------- */
function signAccessToken(user) {
  const jti = uuidv4(); // ไว้ใช้สำหรับตรวจสอบใน jwt_blacklist
  return jwt.sign(
    { jti, user_id: user.user_id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
}

/* ---------- สมัครสมาชิกใหม่ (Register) ---------- */
exports.register = async (req, res) => {
  try {
    const { username, email, password, ...rest } = req.body;

    // ตรวจสอบว่ามีชื่อผู้ใช้นี้อยู่ในระบบหรือไม่
    if (await getUserByUsername(username)) {
      return res.status(400).json({ error: 'ชื่อผู้ใช้นี้ถูกใช้ไปแล้ว' });
    }

    // เข้ารหัสรหัสผ่านด้วย bcrypt
    const hash = await bcrypt.hash(password, 10);

    // สร้าง user ใหม่ลงในฐานข้อมูล
    const user_id = await createUser({
      username,
      email,
      password: hash,
      ...rest
    });

    // สร้าง Access Token และ Refresh Token
    const accessToken = signAccessToken({ user_id, username });
    const refreshToken = await createRefreshToken(user_id, 7); // 7 วัน

    // ส่ง Token และข้อมูล user กลับไปที่ Client
    res.json({ accessToken, refreshToken, user_id });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดขณะสมัครสมาชิก' });
  }
};

/* ---------- เข้าสู่ระบบ (Login) ---------- */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ดึงข้อมูลผู้ใช้งานจากชื่อผู้ใช้ (username)
    const user = await getUserByUsername(username);

    // ตรวจสอบความถูกต้องของ username/password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // สร้าง Access Token และ Refresh Token
    const accessToken = signAccessToken(user);
    const refreshToken = await createRefreshToken(user.user_id, 7); // 7 วัน

    // ส่ง Token กลับไปที่ Client
    res.json({ accessToken, refreshToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดขณะเข้าสู่ระบบ' });
  }
};

/* ---------- ขอ Access Token ใหม่ (Refresh Token) ---------- */
exports.refresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // ตรวจสอบว่ามีการส่ง refresh token มาหรือไม่
    if (!refreshToken) {
      return res.status(400).json({ error: 'กรุณาแนบ Refresh Token มาด้วย' });
    }

    // ตรวจสอบความถูกต้องของ refresh token
    const tokenData = await verifyRefreshToken(refreshToken);
    if (!tokenData) {
      return res.status(401).json({ error: 'Refresh Token ไม่ถูกต้องหรือหมดอายุ' });
    }

    // สร้าง Access Token ใหม่ส่งกลับไปให้ Client
    const accessToken = signAccessToken({ user_id: tokenData.user_id, username: '' });
    res.json({ accessToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการขอ Access Token ใหม่' });
  }
};

/* ---------- ออกจากระบบ (Logout) ---------- */
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    // เพิกถอน Refresh Token (หากมีการส่งมาจาก Client)
    if (refreshToken) {
      const tokenData = await verifyRefreshToken(refreshToken);
      if (tokenData) {
        await revokeRefreshToken(tokenData.token_id);
      }
    }

    // เพิ่ม Access Token ปัจจุบันลงใน jwt_blacklist เพื่อป้องกันการนำไปใช้ต่อ
    await db.query(
      `INSERT IGNORE INTO jwt_blacklist (jti, user_id, expired_at)
       VALUES (?, ?, FROM_UNIXTIME(?))`,
      [req.user.jti, req.user.user_id, req.user.exp]
    );

    // ส่งข้อความยืนยันว่าการ Logout สำเร็จ
    res.json({ message: 'ออกจากระบบเรียบร้อยแล้ว' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการออกจากระบบ' });
  }
};
