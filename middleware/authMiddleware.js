const jwt = require('jsonwebtoken');
const db  = require('../config/db');

module.exports = async (req, res, next) => {
  const hdr = req.headers.authorization;
  if (!hdr) return res.status(401).json({ error: 'No token' });

  try {
    const token = hdr.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // เช็ก jti อยู่ใน blacklist ไหม
    const [rows] = await db.query('SELECT 1 FROM jwt_blacklist WHERE jti = ? LIMIT 1', [payload.jti]);
    if (rows.length) return res.status(401).json({ error: 'Token ถูกยกเลิกแล้ว' });

    req.user = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
