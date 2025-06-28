// routes/approvalFlowRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");

const flowController = require("../controllers/approvalFlowController");

// ใช้งาน middleware ตรวจสอบ JWT ทุกเส้นทาง
router.use(auth);

/**
 * @swagger
 * tags:
 *   name: ApprovalFlows
 *   description: การจัดการขั้นตอนการอนุมัติ
 */

/**
 * @swagger
 * /approval-flows:
 *   post:
 *     summary: สร้าง Flow การอนุมัติใหม่
 *     tags: [ApprovalFlows]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flow_name:
 *                 type: string
 *                 example: "อนุมัติทั่วไป"
 *               flow_description:
 *                 type: string
 *                 example: "ใช้สำหรับงานทั่วไป"
 *     responses:
 *       201:
 *         description: สร้าง Flow สำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบถ้วน
 */
router.post("/", flowController.createFlow); // สร้าง flow ใหม่

/**
 * @swagger
 * /approval-flows:
 *   get:
 *     summary: ดึงรายการ Flow การอนุมัติทั้งหมด
 *     tags: [ApprovalFlows]
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ
 */
router.get("/", flowController.getAllFlows); // ดึง flow ทั้งหมด

/**
 * @swagger
 * /approval-flows/{id}:
 *   get:
 *     summary: ดึงข้อมูล Flow รายการเดียว
 *     tags: [ApprovalFlows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ดึงสำเร็จ
 *       404:
 *         description: ไม่พบข้อมูล
 */
router.get("/:id", flowController.getFlowById); // ดึง flow รายการเดียว

/**
 * @swagger
 * /approval-flows/{id}:
 *   put:
 *     summary: แก้ไขข้อมูล Flow
 *     tags: [ApprovalFlows]
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
 *               flow_name:
 *                 type: string
 *                 example: "อนุมัติทั่วไป"
 *               flow_description:
 *                 type: string
 *                 example: "ใช้สำหรับงานทั่วไป"
 *     responses:
 *       200:
 *         description: แก้ไขข้อมูลสำเร็จ
 *       404:
 *         description: ไม่พบข้อมูล
 */
router.put("/:id", flowController.updateFlow); // แก้ไขข้อมูล flow

/**
 * @swagger
 * /approval-flows/{id}/deactivate:
 *   put:
 *     summary: ปิดการใช้งาน Flow
 *     tags: [ApprovalFlows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ปิดการใช้งานสำเร็จ
 */
router.put("/:id/deactivate", flowController.deactivateFlow); // ปิดการใช้งาน flow

/**
 * @swagger
 * /approval-flows/{id}/activate:
 *   put:
 *     summary: เปิดใช้งาน Flow
 *     tags: [ApprovalFlows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: เปิดการใช้งานสำเร็จ
 */
router.put("/:id/activate", flowController.activateFlow); // เปิดการใช้งาน flow

/**
 * @swagger
 * /approval-flows/{id}:
 *   delete:
 *     summary: ลบ Flow การอนุมัติ (ไม่ลบ step)
 *     tags: [ApprovalFlows]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 */
router.delete("/:id", flowController.deleteFlow); // ลบ flow (ไม่ลบ step)

module.exports = router;
