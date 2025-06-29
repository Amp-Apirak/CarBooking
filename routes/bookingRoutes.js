// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/bookingController");

// ใช้งาน middleware ตรวจสอบ JWT ทุกเส้นทาง
router.use(auth);

// CRUD Bookings

/**
 * @swagger
 * tags:
 *   - name: Bookings
 *     description: ระบบการจองรถยนต์
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     summary: ดึงรายการจองทั้งหมด
 *     tags: [Bookings]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/", ctrl.list); // GET /api/bookings

/**
 * @swagger
 * /bookings/{id}:
 *   get:
 *     summary: ดึงรายละเอียดการจองตาม ID
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "b501a18cfd5e4587a761a9df32b28e30"
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/:id", ctrl.getById); // GET /api/bookings/:id

/**
 * @swagger
 * /bookings:
 *   post:
 *     summary: สร้างการจองใหม่
 *     tags: [Bookings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - vehicle_id
 *               - start_time
 *               - end_time
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "f9591a0215794225b088d53b6d2ef37d"
 *               vehicle_id:
 *                 type: string
 *                 example: "ce4c794c341c4ca9bc74d6484cdcbe22"
 *               driver_id:
 *                 type: string
 *                 example: "3b1f8a7c5d9e2f6a4c8b0d1e3f5a7c9d"
 *               num_passengers:
 *                 type: integer
 *                 example: 2
 *               reason:
 *                 type: string
 *                 example: "ไปรับเอกสาร"
 *               phone:
 *                 type: string
 *                 example: "0812345678"
 *               origin_location:
 *                 type: string
 *                 example: "สํานักงานใหญ่"
 *               destination_location:
 *                 type: string
 *                 example: "สาขา 4"
 *               start_odometer:
 *                 type: integer
 *                 example: 1000
 *               end_odometer:
 *                 type: integer
 *                 example: 1050
 *               total_distance:
 *                 type: number
 *                 format: float
 *                 example: 50.00
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "09:00:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "12:00:00"
 *               status:
 *                 type: string
 *                 enum: ["pending"]
 *               flow_id:
 *                 type: string
 *                 example: "2c9cd21bd64b4447af7cb1c8cc03c31b"
 *     responses:
 *       201:
 *         description: สร้างเรียบร้อย
 */
router.post("/", ctrl.create); // POST /api/bookings

/**
 * @swagger
 * /bookings/{id}:
 *   put:
 *     summary: แก้ไขการจอง
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสการจอง
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: "1b695713b98d47acb3bc8767b2cc0e37"
 *               vehicle_id:
 *                 type: string
 *                 example: "26a11c410f824305bb2d73e22801161f"
 *               driver_id:
 *                 type: string
 *                 example: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
 *               num_passengers:
 *                 type: integer
 *                 example: 2
 *               reason:
 *                 type: string
 *                 example: "ไปรับเอกสาร"
 *               phone:
 *                 type: string
 *                 example: "0812345678"
 *               origin_location:
 *                 type: string
 *                 example: "สํานักงานใหญ่"
 *               destination_location:
 *                 type: string
 *                 example: "สาขา 4"
 *               start_odometer:
 *                 type: integer
 *                 example: 1000
 *               end_odometer:
 *                 type: integer
 *                 example: 1050
 *               total_distance:
 *                 type: number
 *                 format: float
 *                 example: 50.00
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               end_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-07-01"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 example: "09:00:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 example: "12:00:00"
 *     responses:
 *       200:
 *         description: อัปเดตเรียบร้อย
 */
router.put("/:id", ctrl.update); // PUT /api/bookings/:id

/**
 * @swagger
 * /bookings/{id}:
 *   delete:
 *     summary: ลบการจอง
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสการจอง
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 */
router.delete("/:id", ctrl.remove); // DELETE /api/bookings/:id

/**
 * @swagger
 * /bookings/{id}/approve:
 *   post:
 *     summary: อนุมัติการจอง
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสการจอง
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: อนุมัติเนื่องจาก...
 *     responses:
 *       200:
 *         description: อนุมัติเรียบร้อยแล้ว
 *       400:
 *         description: ข้อมูลไม่ครบถ้วน
 *       404:
 *         description: ไม่พบข้อมูลการจอง
 *       403:
 *         description: ไม่มีสิทธิ์อนุมัติการจองนี้
 */

router.post("/:id/approve", ctrl.approveBooking); // POST /api/bookings/:id/approve

/**
 * @swagger
 * /bookings/{id}/reject:
 *   post:
 *     summary: ปฏิเสธการจอง
 *     tags: [Bookings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสการจอง
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 example: ไม่อนุมัติเนื่องจาก...
 *     responses:
 *       200:
 *         description: ปฏิเสธเรียบร้อย
 *       400:
 *         description: ข้อมูลไม่ครบถ้วน
 *       404:
 *         description: ไม่พบข้อมูลการจอง
 */
router.post("/:id/reject", ctrl.rejectBooking); // POST /api/bookings/:id/reject

module.exports = router;
