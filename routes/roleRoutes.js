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

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: ดึงข้อมูลบทบาทตาม ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: ดึงข้อมูลบทบาทสำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 role_id:
 *                   type: string
 *                   example: "a1b2c3d4"
 *                 name:
 *                   type: string
 *                   example: "admin"
 *       404:
 *         description: ไม่พบบทบาทที่ระบุ
 */
router.get("/:id", roleController.getById); // GET /api/roles/:id

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: แก้ไขข้อมูลบทบาท
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
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
 *                 example: "updated_manager"
 *     responses:
 *       200:
 *         description: อัปเดตบทบาทสำเร็จ
 *       404:
 *         description: ไม่พบบทบาทที่ระบุ
 */
router.put("/:id", roleController.update); // PUT /api/roles/:id

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: ลบบทบาท
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID
 *     responses:
 *       200:
 *         description: ลบบทบาทสำเร็จ
 *       404:
 *         description: ไม่พบบทบาทที่ระบุ
 */
router.delete("/:id", roleController.remove); // DELETE /api/roles/:id

module.exports = router;
