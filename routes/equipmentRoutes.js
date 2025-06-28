// routes/equipmentRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/equipmentController');

// ใช้งาน middleware ตรวจสอบ JWT ทุกเส้นทาง
router.use(auth);

/**
 * @swagger
 * tags:
 *   - name: Equipments
 *     description: ระบบการจัดการอุปกรณ์
 */

/**
 * @swagger
 * /equipments:
 *   get:
 *     summary: ดึงรายการอุปกรณ์ทั้งหมด
 *     tags: [Equipments]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: คำค้นหาในชื่อหรือคำอธิบายอุปกรณ์
 *     responses:
 *       200:
 *         description: สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       equipment_id:
 *                         type: string
 *                       equipment_name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                 pagination:
 *                   type: object
 */
router.get('/', ctrl.list); // GET /api/equipments

/**
 * @swagger
 * /equipments/all:
 *   get:
 *     summary: ดึงรายการอุปกรณ์ทั้งหมด (ไม่มี pagination)
 *     tags: [Equipments]
 *     description: สำหรับใช้ใน dropdown หรือ select list
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/all', ctrl.listAll); // GET /api/equipments/all

/**
 * @swagger
 * /equipments/booking/{bookingId}:
 *   get:
 *     summary: ดึงอุปกรณ์ที่ใช้ในการจองเฉพาะ
 *     tags: [Equipments]
 *     parameters:
 *       - in: path
 *         name: bookingId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/booking/:bookingId', ctrl.getByBooking); // GET /api/equipments/booking/:bookingId

/**
 * @swagger
 * /equipments/vehicle/{vehicleId}:
 *   get:
 *     summary: ดึงอุปกรณ์ที่เชื่อมโยงกับรถเฉพาะ
 *     tags: [Equipments]
 *     parameters:
 *       - in: path
 *         name: vehicleId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get('/vehicle/:vehicleId', ctrl.getByVehicle); // GET /api/equipments/vehicle/:vehicleId

/**
 * @swagger
 * /equipments/{id}:
 *   get:
 *     summary: ดึงรายละเอียดอุปกรณ์ตาม ID
 *     tags: [Equipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบอุปกรณ์
 */
router.get('/:id', ctrl.getById); // GET /api/equipments/:id

/**
 * @swagger
 * /equipments:
 *   post:
 *     summary: สร้างอุปกรณ์ใหม่
 *     tags: [Equipments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - equipment_name
 *               - description
 *             properties:
 *               equipment_name:
 *                 type: string
 *                 example: "กล้องติดรถยนต์"
 *               description:
 *                 type: string
 *                 example: "บันทึกภาพขณะขับขี่"
 *     responses:
 *       201:
 *         description: สร้างอุปกรณ์สำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบถ้วน
 */
router.post('/', ctrl.create); // POST /api/equipments

/**
 * @swagger
 * /equipments/{id}:
 *   put:
 *     summary: แก้ไขข้อมูลอุปกรณ์
 *     tags: [Equipments]
 *     parameters:
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
 *               equipment_name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: แก้ไขข้อมูลสำเร็จ
 *       404:
 *         description: ไม่พบอุปกรณ์
 */
router.put('/:id', ctrl.update); // PUT /api/equipments/:id

/**
 * @swagger
 * /equipments/{id}:
 *   delete:
 *     summary: ลบอุปกรณ์
 *     tags: [Equipments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ลบอุปกรณ์เรียบร้อย
 *       400:
 *         description: ไม่สามารถลบได้เนื่องจากมีการใช้งาน
 *       404:
 *         description: ไม่พบอุปกรณ์
 */
router.delete('/:id', ctrl.remove); // DELETE /api/equipments/:id

module.exports = router;
