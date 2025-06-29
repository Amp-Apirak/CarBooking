// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/userController");
const checkPermission = require("../middleware/checkPermission");

// Middleware สำหรับทุก route
router.use(auth);

// ตั้งค่า multer สำหรับอัปโหลด avatar
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/avatars/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, req.user.user_id + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  },
  fileFilter: function (req, file, cb) {
    // ตรวจสอบประเภทไฟล์
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("อนุญาตเฉพาะไฟล์รูปภาพเท่านั้น"), false);
    }
  }
});

/**
 * @swagger
 * tags:
 *   - name: User Profile
 *     description: ระบบจัดการโปรไฟล์ผู้ใช้
 *   - name: User Management
 *     description: ระบบจัดการผู้ใช้ (Admin)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: string
 *           description: รหัสผู้ใช้
 *         username:
 *           type: string
 *           description: ชื่อผู้ใช้
 *         email:
 *           type: string
 *           description: อีเมล
 *         first_name:
 *           type: string
 *           description: ชื่อ
 *         last_name:
 *           type: string
 *           description: นามสกุล
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: เพศ
 *         citizen_id:
 *           type: string
 *           description: เลขบัตรประชาชน
 *         phone:
 *           type: string
 *           description: เบอร์โทรศัพท์
 *         address:
 *           type: string
 *           description: ที่อยู่
 *         country:
 *           type: string
 *           description: ประเทศ
 *         province:
 *           type: string
 *           description: จังหวัด
 *         postal_code:
 *           type: string
 *           description: รหัสไปรษณีย์
 *         avatar_path:
 *           type: string
 *           description: ที่อยู่ไฟล์ avatar
 *         organization_id:
 *           type: string
 *           description: รหัสองค์กร
 *         status:
 *           type: string
 *           description: สถานะ
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     
 *     UserProfileUpdate:
 *       type: object
 *       properties:
 *         first_name:
 *           type: string
 *           description: ชื่อ
 *         last_name:
 *           type: string
 *           description: นามสกุล
 *         gender:
 *           type: string
 *           enum: [male, female, other]
 *           description: เพศ
 *         citizen_id:
 *           type: string
 *           description: เลขบัตรประชาชน
 *         phone:
 *           type: string
 *           description: เบอร์โทรศัพท์
 *         address:
 *           type: string
 *           description: ที่อยู่
 *         country:
 *           type: string
 *           description: ประเทศ
 *         province:
 *           type: string
 *           description: จังหวัด
 *         postal_code:
 *           type: string
 *           description: รหัสไปรษณีย์
 */

// ===== User Profile Routes =====

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: ไม่พบข้อมูลผู้ใช้
 *       401:
 *         description: ไม่ได้รับอนุญาต
 */
router.get("/profile", ctrl.getProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: อัปเดตโปรไฟล์ผู้ใช้ปัจจุบัน
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileUpdate'
 *     responses:
 *       200:
 *         description: อัปเดตสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบข้อมูลผู้ใช้
 *       401:
 *         description: ไม่ได้รับอนุญาต
 */
router.put("/profile", ctrl.updateProfile);

/**
 * @swagger
 * /api/users/avatar:
 *   post:
 *     summary: อัปโหลด avatar ของผู้ใช้
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: ไฟล์รูปภาพ (ขนาดไม่เกิน 2MB)
 *     responses:
 *       200:
 *         description: อัปโหลดสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     avatar_path:
 *                       type: string
 *       400:
 *         description: ไฟล์ไม่ถูกต้อง
 *       401:
 *         description: ไม่ได้รับอนุญาต
 */
router.post("/avatar", upload.single("avatar"), ctrl.uploadAvatar);

/**
 * @swagger
 * /api/users/change-password:
 *   put:
 *     summary: เปลี่ยนรหัสผ่านผู้ใช้ปัจจุบัน
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - current_password
 *               - new_password
 *             properties:
 *               current_password:
 *                 type: string
 *                 description: รหัสผ่านปัจจุบัน
 *               new_password:
 *                 type: string
 *                 description: รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: เปลี่ยนรหัสผ่านสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบข้อมูลผู้ใช้
 *       401:
 *         description: ไม่ได้รับอนุญาต
 */
router.put("/change-password", ctrl.changePassword);

// ===== Admin User Management Routes =====

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: ค้นหาผู้ใช้
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *         description: คำค้นหา (ชื่อ, นามสกุล, username, email)
 *       - in: query
 *         name: organization_id
 *         schema:
 *           type: string
 *         description: กรองตามองค์กร
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: กรองตามสถานะ
 *     responses:
 *       200:
 *         description: ค้นหาสำเร็จ
 *       400:
 *         description: คำค้นหาไม่ถูกต้อง
 *       401:
 *         description: ไม่ได้รับอนุญาต
 */
router.get("/search", checkPermission("view_users"), ctrl.search);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: ดึงรายการผู้ใช้ทั้งหมด (Admin)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: หน้าที่ต้องการ
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: จำนวนรายการต่อหน้า
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: กรองตามสถานะ
 *       - in: query
 *         name: organization_id
 *         schema:
 *           type: string
 *         description: กรองตามองค์กร
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     current_page:
 *                       type: integer
 *                     per_page:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     total_pages:
 *                       type: integer
 *       401:
 *         description: ไม่ได้รับอนุญาต
 */
router.get("/", checkPermission("view_users"), ctrl.list);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: ดึงข้อมูลผู้ใช้ตาม ID (Admin)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสผู้ใช้
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: ไม่พบผู้ใช้
 *       401:
 *         description: ไม่ได้รับอนุญาต
 */
router.get("/:id", checkPermission("view_users"), ctrl.getById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: อัปเดตข้อมูลผู้ใช้ (Admin)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสผู้ใช้
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserProfileUpdate'
 *     responses:
 *       200:
 *         description: อัปเดตสำเร็จ
 *       404:
 *         description: ไม่พบผู้ใช้
 *       401:
 *         description: ไม่ได้รับอนุญาต
 */
router.put("/:id", checkPermission("manage_users"), ctrl.update);

/**
 * @swagger
 * /api/users/{id}/status:
 *   put:
 *     summary: เปลี่ยนสถานะผู้ใช้ (Admin)
 *     tags: [User Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสผู้ใช้
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *                 description: สถานะใหม่
 *     responses:
 *       200:
 *         description: เปลี่ยนสถานะสำเร็จ
 *       400:
 *         description: สถานะไม่ถูกต้อง
 *       404:
 *         description: ไม่พบผู้ใช้
 *       401:
 *         description: ไม่ได้รับอนุญาต
 */
router.put("/:id/status", checkPermission("manage_users"), ctrl.updateStatus);

module.exports = router;