// routes/approvalStepRoutes.js

const express = require("express");
const router = express.Router();

const stepController = require("../controllers/approvalStepController");
/**
 * @swagger
 * tags:
 *   name: ApprovalSteps
 *   description: จัดการขั้นตอนในแต่ละ Flow การอนุมัติ
 */

/**
 * @swagger
 * /approval-flows/{flow_id}/steps:
 *   post:
 *     summary: เพิ่มขั้นตอนใหม่ใน Flow
 *     tags: [ApprovalSteps]
 *     parameters:
 *       - in: path
 *         name: flow_id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [step_order, role_id, step_name]
 *             properties:
 *               step_order:
 *                 type: integer
 *                 example: 1
 *               role_id:
 *                 type: string
 *                 example: "role-001"
 *               step_name:
 *                 type: string
 *                 example: "ผู้อนุมัติระดับ 1"
 *     responses:
 *       201:
 *         description: เพิ่มขั้นตอนสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบ
 */
router.post("/:flow_id/steps", stepController.createStep); // เพิ่มขั้นตอนใน flow

/**
 * @swagger
 * /approval-flows/{flow_id}/steps:
 *   get:
 *     summary: ดึงรายการขั้นตอนทั้งหมดใน Flow
 *     tags: [ApprovalSteps]
 *     parameters:
 *       - in: path
 *         name: flow_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ดึงสำเร็จ
 */
router.get("/:flow_id/steps", stepController.getStepsByFlow); // ดึงขั้นตอนทั้งหมดของ flow

/**
 * @swagger
 * /approval-flows/{flow_id}/steps:
 *   delete:
 *     summary: ลบขั้นตอนทั้งหมดใน Flow
 *     tags: [ApprovalSteps]
 *     parameters:
 *       - in: path
 *         name: flow_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ลบขั้นตอนทั้งหมดสำเร็จ
 */
router.delete("/:flow_id/steps", stepController.deleteStepsByFlow); // ลบทุกขั้นตอนของ flow

module.exports = router;
