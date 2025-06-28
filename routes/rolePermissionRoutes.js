// routes/rolePermissionRoutes.js
const express = require("express");
const router = express.Router();
const rolePermissionController = require("../controllers/rolePermissionController");

/**
 * @swagger
 * tags:
 *   name: RolePermissions
 *   description: จัดการสิทธิ์ของบทบาท (Assign/Remove Permission)
 */

/**
 * @swagger
 * /role-permissions/{role_id}:
 *   get:
 *     summary: ดึงรายการสิทธิ์ของบทบาทตาม ID
 *     tags: [RolePermissions]
 *     parameters:
 *       - in: path
 *         name: role_id
 *         required: true
 *         schema:
 *           type: string
 *           example: "a1b2c3d4"
 *     responses:
 *       200:
 *         description: ดึงรายการสิทธิ์สำเร็จ
 */
router.get("/:role_id", rolePermissionController.getPermissionsByRole);

/**
 * @swagger
 * /role-permissions/assign:
 *   post:
 *     summary: มอบสิทธิ์ให้บทบาท
 *     tags: [RolePermissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *               - permission_id
 *             properties:
 *               role_id:
 *                 type: string
 *                 example: "a1b2c3d4"
 *               permission_id:
 *                 type: string
 *                 example: "perm-001"
 *     responses:
 *       200:
 *         description: มอบสิทธิ์สำเร็จ
 *       400:
 *         description: ค่าที่ส่งมาไม่ถูกต้อง
 */
router.post("/assign", rolePermissionController.assignPermission);

/**
 * @swagger
 * /role-permissions/remove:
 *   post:
 *     summary: ลบสิทธิ์ออกจากบทบาท
 *     tags: [RolePermissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role_id
 *               - permission_id
 *             properties:
 *               role_id:
 *                 type: string
 *                 example: "a1b2c3d4"
 *               permission_id:
 *                 type: string
 *                 example: "perm-001"
 *     responses:
 *       200:
 *         description: ลบสิทธิ์สำเร็จ
 *       400:
 *         description: ค่าที่ส่งมาไม่ถูกต้อง
 */

router.post("/remove", rolePermissionController.removePermission);

module.exports = router;
