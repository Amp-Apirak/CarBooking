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

/**
 * @swagger
 * /permissions/{id}:
 *   get:
 *     summary: ดึงข้อมูลสิทธิ์ตาม ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสิทธิ์สำเร็จ
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 permission_id:
 *                   type: string
 *                   example: "perm001"
 *                 name:
 *                   type: string
 *                   example: "create_vehicle"
 *                 description:
 *                   type: string
 *                   example: "สามารถสร้างรถใหม่ได้"
 *       404:
 *         description: ไม่พบสิทธิ์ที่ระบุ
 */
router.get("/:id", permissionController.getById); // GET /permissions/:id - Get permission by ID

/**
 * @swagger
 * /permissions/{id}:
 *   put:
 *     summary: แก้ไขข้อมูลสิทธิ์
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
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
 *                 example: "update_vehicle"
 *               description:
 *                 type: string
 *                 example: "สามารถแก้ไขข้อมูลรถได้"
 *     responses:
 *       200:
 *         description: อัปเดตสิทธิ์สำเร็จ
 *       400:
 *         description: ข้อมูลไม่ถูกต้อง
 *       404:
 *         description: ไม่พบสิทธิ์ที่ระบุ
 */
router.put("/:id", permissionController.update); // PUT /permissions/:id - Update permission

/**
 * @swagger
 * /permissions/{id}:
 *   delete:
 *     summary: ลบสิทธิ์
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: ลบสิทธิ์สำเร็จ
 *       404:
 *         description: ไม่พบสิทธิ์ที่ระบุ
 */
router.delete("/:id", permissionController.remove); // DELETE /permissions/:id - Delete permission

module.exports = router;
