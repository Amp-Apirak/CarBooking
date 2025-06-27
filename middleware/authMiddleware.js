// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * Middleware สำหรับตรวจสอบ JWT และ token blacklist
 * - ต้องแน่ใจว่า JWT ที่สร้างมี `jti`
 */
module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ตรวจสอบว่ามี Authorization Header หรือไม่
  if (!authHeader) {
    return res.status(401).json({ error: 'ไม่ได้รับ Token' });
  }

  try {
    // แยก Bearer ออก (Bearer <token>)
    const token = authHeader.split(' ')[1];

    // ตรวจสอบและถอดรหัส token
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // ตรวจสอบ jti (JWT ID) ว่าถูกระงับแล้วหรือไม่
    if (!payload.jti) {
      return res.status(401).json({ error: 'Token ไม่มี jti (JWT ID)' });
    }

    const [rows] = await db.query(
      'SELECT 1 FROM jwt_blacklist WHERE jti = ? LIMIT 1',
      [payload.jti]
    );

    if (rows.length > 0) {
      return res.status(401).json({ error: 'Token นี้ถูกยกเลิกแล้ว' });
    }

    // แนบข้อมูลผู้ใช้ลงใน req
    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT ตรวจสอบไม่ผ่าน:', err.message);
    return res.status(401).json({ error: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }
};
