// routes/roleRoutes.js
const express = require("express");
const router = express.Router();

const roleController = require("../controllers/roleController");

/**
 * @swagger
 * tags:
 *   - name: Roles
 *     description: ระบบบทบาท
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: ดึงรายการบทบาททั้งหมด
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: ดึงรายการบทบาทสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "a1b2c3d4"
 *                   name:
 *                     type: string
 *                     example: "admin"
 */
router.get("/", roleController.listRoles); // GET /api/roles


/**
 * @swagger
 * /roles:
 *   post:
 *     summary: สร้างบทบาทใหม่
 *     tags: [Roles]
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
 *                 example: "manager"
 *     responses:
 *       201:
 *         description: สร้างบทบาทสำเร็จ
 */
router.post("/", roleController.create); // POST /api/roles

module.exports = router;
