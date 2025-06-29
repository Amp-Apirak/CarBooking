// routes/userRoleRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/userRoleController");

/**
 * @swagger
 * tags:
 *   name: UserRoles
 *   description: จัดการการมอบบทบาทให้ผู้ใช้
 */

/**
 * @swagger
 * /user-roles/assign:
 *   post:
 *     summary: มอบบทบาทให้ผู้ใช้
 *     tags: [UserRoles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_id, role_id]
 *             properties:
 *               user_id:
 *                 type: string
 *               role_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: มอบบทบาทสำเร็จ
 */
router.post("/assign", auth, ctrl.assignRole);

/**
 * @swagger
 * /user-roles/remove:
 *   post:
 *     summary: ถอนบทบาทจากผู้ใช้
 *     tags: [UserRoles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user_role_id]
 *             properties:
 *               user_role_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: ถอนบทบาทสำเร็จ
 */
router.post("/remove", auth, ctrl.removeRole);

/**
 * @swagger
 * /user-roles/{user_id}:
 *   get:
 *     summary: ดึงบทบาททั้งหมดของผู้ใช้
 *     tags: [UserRoles]
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
router.get("/:user_id", auth, ctrl.listRolesByUser);

module.exports = router;
