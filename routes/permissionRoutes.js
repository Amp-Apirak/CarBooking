// routes/permissionRoutes.js
const express = require("express");
const router = express.Router();
const permissionController = require("../controllers/permissionController");

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: จัดการสิทธิ์การใช้งาน (Permissions)
 */

/**
 * @swagger
 * /permissions:
 *   get:
 *     summary: ดึงรายการสิทธิ์ทั้งหมด
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: ดึงรายการสำเร็จ
 */
router.get("/", permissionController.list); // GET /permissions - List all permissions

/**
 * @swagger
 * /permissions:
 *   post:
 *     summary: สร้างสิทธิ์ใหม่
 *     tags: [Permissions]
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
 *                 example: "create_vehicle"
 *               description:
 *                 type: string
 *                 example: "สามารถสร้างรถใหม่ได้"
 *     responses:
 *       201:
 *         description: สร้างสิทธิ์สำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 */
router.post("/", permissionController.create); // POST /permissions - Create new permission

module.exports = router;
