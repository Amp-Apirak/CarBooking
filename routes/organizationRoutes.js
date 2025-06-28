// routes/organizationRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/organizationController");

/**
 * @swagger
 * tags:
 *   name: Organizations
 *   description: จัดการองค์กร (Organizations)
 */

/**
 * @swagger
 * /organizations:
 *   get:
 *     summary: ดึงรายการองค์กรทั้งหมด
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/", auth, ctrl.list);

/**
 * @swagger
 * /organizations/accessible:
 *   get:
 *     summary: ดึงรายการองค์กรที่ผู้ใช้สามารถเข้าถึงได้
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/accessible", auth, ctrl.getAccessible);

/**
 * @swagger
 * /organizations/{id}:
 *   get:
 *     summary: ดึงข้อมูลองค์กรตาม ID
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: '4a5464e929124739c30aa10330b6712'
 *     responses:
 *       200:
 *         description: สำเร็จ
 *       404:
 *         description: ไม่พบองค์กร
 */
router.get("/:id", auth, ctrl.getById);

/**
 * @swagger
 * /organizations:
 *   post:
 *     summary: สร้างองค์กรใหม่
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'โรงพยาบาลส่งเสริมสุขภาพบ้านห้วยสูบ'
 *               parent_id:
 *                 type: string
 *                 example: '2e950612491a11f08b210242ac120002'
 *               path:
 *                 type: string
 *                 example: '2e950612491a11f08b210242ac120002/bf4f9c05543611f097453417ebbed40a'
 *     responses:
 *       201:
 *         description: สร้างองค์กรสำเร็จ
 */
router.post("/", auth, ctrl.create);

/**
 * @swagger
 * /organizations/{id}:
 *   put:
 *     summary: แก้ไขชื่อองค์กร
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: '4a5464e929124739c30aa10330b6712'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: 'HR Department Updated'
 *     responses:
 *       200:
 *         description: แก้ไขเรียบร้อย
 */
router.put("/:id", auth, ctrl.update);

/**
 * @swagger
 * /organizations/{id}:
 *   delete:
 *     summary: ลบองค์กร
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: '4a5464e929124739c30aa10330b6712'
 *     responses:
 *       200:
 *         description: ลบองค์กรเรียบร้อย
 */
router.delete("/:id", auth, ctrl.remove);

/**
 * @swagger
 * /organizations/{id}/children:
 *   get:
 *     summary: ดึงองค์กรลูกทั้งหมด
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/:id/children", auth, ctrl.getChildren);

/**
 * @swagger
 * /organizations/{id}/hierarchy:
 *   get:
 *     summary: ดึงโครงสร้างองค์กรทั้งหมด (รวมลูกหลาน)
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/:id/hierarchy", auth, ctrl.getHierarchy);

/**
 * @swagger
 * /organizations/{id}/grant-access:
 *   post:
 *     summary: ให้สิทธิ์ผู้ใช้เข้าถึงองค์กร
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: 'user_uuid_here'
 *     responses:
 *       200:
 *         description: ให้สิทธิ์เรียบร้อย
 */
router.post("/:id/grant-access", auth, ctrl.grantAccess);

/**
 * @swagger
 * /organizations/{id}/revoke-access:
 *   delete:
 *     summary: ยกเลิกสิทธิ์การเข้าถึงองค์กร
 *     tags: [Organizations]
 *     security:
 *       - bearerAuth: []
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
 *             required:
 *               - user_id
 *             properties:
 *               user_id:
 *                 type: string
 *                 example: 'user_uuid_here'
 *     responses:
 *       200:
 *         description: ยกเลิกสิทธิ์เรียบร้อย
 */
router.delete("/:id/revoke-access", auth, ctrl.revokeAccess);

module.exports = router;
