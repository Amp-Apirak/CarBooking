const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/bookingEquipmentController");

router.use(auth);

/**
 * @swagger
 * tags:
 *   - name: Booking Equipments
 *     description: ระบบการเชื่อมโยงการจองและอุปกรณ์เสริม
 */

/**
 * @swagger
 * /bookings/{booking_id}/equipments:
 *   get:
 *     summary: รายการอุปกรณ์เสริมของการจอง
 *     tags: [Booking Equipments]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/", ctrl.getAll); // GET /api/bookings/:id/equipments


/**
 * @swagger
 * /bookings/{booking_id}/equipments/{id}:
 *   get:
 *     summary: ดึงรายละเอียดอุปกรณ์ตาม ID
 *     tags: [Booking Equipments]
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ดึงข้อมูลอุปกรณ์สำเร็จ
 *       404:
 *         description: ไม่พบอุปกรณ์
 */
router.get("/:equipId", ctrl.getById); // GET /api/bookings/:id/equipments/:equipId

/**
 * @swagger
 * /bookings/{booking_id}/equipments:
 *   post:
 *     summary: เพิ่มอุปกรณ์สำหรับการจอง
 *     tags: [Booking Equipments]
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipment_id:
 *                 type: string
 *                 example: "1b695713b98d47acb3bc8767b2cc0e37"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: เพิ่มอุปกรณ์สำเร็จ
 */
router.post("/", ctrl.add); // POST /api/bookings/:id/equipments

/**
 * @swagger
 * /bookings/{booking_id}/equipments/{id}:
 *   put:
 *     summary: แก้ไขข้อมูลอุปกรณ์ของการจอง
 *     tags: [Booking Equipments]
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               equipment_id:
 *                 type: string
 *                 example: "1b695713b98d47acb3bc8767b2cc0e37"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: แก้ไขข้อมูลสำเร็จ
 */
router.put("/:equipId", ctrl.update); // PUT /api/bookings/:id/equipments/:equipId

/**
 * @swagger
 * /bookings/{booking_id}/equipments/{id}:
 *   delete:
 *     summary: ลบอุปกรณ์ของการจอง
 *     tags: [Booking Equipments]
 *     parameters:
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ลบอุปกรณ์เรียบร้อย
 */
router.delete("/:equipId", ctrl.remove); // DELETE /api/bookings/:id/equipments/:equipId

module.exports = router;
