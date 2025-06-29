// routes/userAllowedOrgRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/userAllowedOrgController");

/**
 * @swagger
 * tags:
 *   name: UserAllowedOrgs
 *   description: จัดการสิทธิ์ดูองค์กรของผู้ใช้
 */

/**
 * @swagger
 * /user-allowed-orgs/assign:
 *   post:
 *     summary: มอบสิทธิ์ดูองค์กรให้ผู้ใช้
 *     tags: [UserAllowedOrgs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, organization_id]
 *             properties:
 *               user_id:
 *                 type: string
 *               organization_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: มอบสิทธิ์สำเร็จ
 */
router.post("/assign", auth, ctrl.assignOrg);

/**
 * @swagger
 * /user-allowed-orgs/remove:
 *   post:
 *     summary: ถอนสิทธิ์ดูองค์กรจากผู้ใช้
 *     tags: [UserAllowedOrgs]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: string
 *     responses:
 *       200:
 *         description: ถอนสิทธิ์สำเร็จ
 */
router.post("/remove", auth, ctrl.removeOrg);

/**
 * @swagger
 * /user-allowed-orgs/{user_id}:
 *   get:
 *     summary: ดึงองค์กรที่ผู้ใช้ดูได้
 *     tags: [UserAllowedOrgs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/:user_id", auth, ctrl.listAllowedOrgs);

module.exports = router;
