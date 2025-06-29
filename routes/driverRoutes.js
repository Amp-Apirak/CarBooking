// routes/driverRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/driverController");
const checkPermission = require("../middleware/checkPermission");

router.use(auth);

/**
 * @swagger
 * tags:
 *   - name: Drivers
 *     description: ระบบจัดการคนขับ
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Driver:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         driver_id:
 *           type: string
 *           description: รหัสคนขับ (UUID)
 *           example: "3b1f8a7c5d9e2f6a4c8b0d1e3f5a7c9d"
 *         name:
 *           type: string
 *           description: ชื่อ-นามสกุลคนขับ
 *           example: "สมชาย ใจดี"
 *         phone:
 *           type: string
 *           description: เบอร์โทรศัพท์
 *           example: "0812345678"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: วันที่สร้าง
 *     
 *     DriverInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: ชื่อ-นามสกุลคนขับ
 *           example: "สมชาย ใจดี"
 *         phone:
 *           type: string
 *           description: เบอร์โทรศัพท์
 *           example: "0812345678"
 */

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: ดึงรายการคนขับทั้งหมด
 *     tags: [Drivers]
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Driver'
 *                 total:
 *                   type: integer
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.get("/", ctrl.list);

/**
 * @swagger
 * /api/drivers/available:
 *   get:
 *     summary: ดึงรายการคนขับที่ว่างในช่วงเวลาที่กำหนด
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: วันที่เริ่มต้น
 *         example: "2025-07-01 09:00:00"
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: วันที่สิ้นสุด
 *         example: "2025-07-01 17:00:00"
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
 *                     $ref: '#/components/schemas/Driver'
 *                 total:
 *                   type: integer
 *                 period:
 *                   type: object
 *                   properties:
 *                     start_date:
 *                       type: string
 *                     end_date:
 *                       type: string
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.get("/available", ctrl.getAvailable);

/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: ดึงข้อมูลคนขับตาม ID
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสคนขับ
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
 *                   $ref: '#/components/schemas/Driver'
 *       404:
 *         description: ไม่พบคนขับ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.get("/:id", ctrl.getById);

/**
 * @swagger
 * /api/drivers/{id}/availability:
 *   get:
 *     summary: ตรวจสอบความพร้อมของคนขับในช่วงเวลาที่กำหนด
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสคนขับ
 *       - in: query
 *         name: start_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: วันที่เริ่มต้น
 *       - in: query
 *         name: end_date
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: วันที่สิ้นสุด
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
 *                   type: object
 *                   properties:
 *                     driver_id:
 *                       type: string
 *                     driver_name:
 *                       type: string
 *                     is_available:
 *                       type: boolean
 *                     period:
 *                       type: object
 *                       properties:
 *                         start_date:
 *                           type: string
 *                         end_date:
 *                           type: string
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบคนขับ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.get("/:id/availability", ctrl.checkAvailability);

/**
 * @swagger
 * /api/drivers:
 *   post:
 *     summary: เพิ่มคนขับใหม่
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DriverInput'
 *     responses:
 *       201:
 *         description: เพิ่มคนขับสำเร็จ
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
 *                   $ref: '#/components/schemas/Driver'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.post("/", checkPermission("manage_drivers"), ctrl.create);

/**
 * @swagger
 * /api/drivers/{id}:
 *   put:
 *     summary: อัปเดตข้อมูลคนขับ
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสคนขับ
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DriverInput'
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
 *                   $ref: '#/components/schemas/Driver'
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบคนขับ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.put("/:id", checkPermission("manage_drivers"), ctrl.update);

/**
 * @swagger
 * /api/drivers/{id}:
 *   delete:
 *     summary: ลบคนขับ
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสคนขับ
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: ไม่พบคนขับ
 *       401:
 *         description: ไม่ได้รับอนุญาต
 *       500:
 *         description: เกิดข้อผิดพลาด
 */
router.delete("/:id", checkPermission("manage_drivers"), ctrl.delete);

module.exports = router;