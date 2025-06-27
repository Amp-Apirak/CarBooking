const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
  login,
  register,
  refresh,
  logout,
  ldapLogin,
} = require("../controllers/authController");

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: ล็อกอินเข้าสู่ระบบ
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newuser
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: ล็อกอินสำเร็จ
 *       401:
 *         description: ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง
 */

router.post("/login", login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: สมัครสมาชิก
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: newuser
 *               email:
 *                 type: string
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       201:
 *         description: สมัครสมาชิกสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */

router.post("/register", register);

/**
 * @swagger
 * /auth/login/ldap:
 *   post:
 *     summary: ล็อกอินผ่าน LDAP (Active Directory)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: ad_user
 *               password:
 *                 type: string
 *                 example: your_password
 *     responses:
 *       200:
 *         description: ล็อกอินผ่าน LDAP สำเร็จ
 *       401:
 *         description: ล็อกอินไม่สำเร็จ
 */
router.post("/login/ldap", ldapLogin);

/**
 * @swagger
 * /auth/token/refresh:
 *   post:
 *     summary: รีเฟรช Access Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: 868168da-61....
 *     responses:
 *       200:
 *         description: ได้ Access Token ใหม่
 *       401:
 *         description: Token ไม่ถูกต้องหรือหมดอายุ
 */
router.post("/token/refresh", refresh);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: ออกจากระบบและเพิกถอน Token
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: ออกจากระบบสำเร็จ
 *       401:
 *         description: ไม่ได้รับ Token หรือ Token ผิด
 */

// Middleware พิเศษสำหรับ logout ที่ไม่ fail เมื่อ token หมดอายุ
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      // ไม่มี token ก็ให้ผ่านไปได้
      return next();
    }

    try {
      const token = authHeader.split(' ')[1];
      const payload = jwt.verify(token, process.env.JWT_SECRET);

      // ตรวจสอบ blacklist
      if (payload.jti) {
        const [rows] = await db.query(
          'SELECT 1 FROM jwt_blacklist WHERE jti = ? LIMIT 1',
          [payload.jti]
        );

        if (rows.length === 0) {
          req.user = payload;
        }
      }
    } catch (err) {
      // ไม่ต้องทำอะไร ให้ logout ทำงานต่อไปได้
      console.log('Token expired or invalid, but allowing logout');
    }

    next();
  } catch (error) {
    console.error('Error in optionalAuth middleware:', error);
    next();
  }
};

router.post("/logout", optionalAuth, logout);

module.exports = router;
