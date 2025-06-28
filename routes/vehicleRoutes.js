// routes/vehicleRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const ctrl = require("../controllers/vehicleController");

router.use(auth);

/**
 * @swagger
 * tags:
 *   - name: Vehicles
 *     description: ระบบจัดการยานพาหนะ
 *   - name: Vehicle Types
 *     description: ระบบจัดการประเภทยานพาหนะ
 *   - name: Vehicle Brands
 *     description: ระบบจัดการยี่ห้อยานพาหนะ
 */

// ------------------------------------ Vehicle Types --------------------------------------

/**
 * @swagger
 * /vehicles/types:
 *   get:
 *     summary: ดึงรายการประเภทรถทั้งหมด
 *     tags: [Vehicle Types]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/types", ctrl.listTypes);

/**
 * @swagger
 * /vehicles/types/{id}:
 *   get:
 *     summary: ดึงรายละเอียดประเภทรถ
 *     tags: [Vehicle Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{32}$'
 *           example: '5fb512404a0011f08325fe6471b6f9ca'
 *         required: true
 *         description: ID ของประเภทรถ (UUID)
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/types/:id", ctrl.getTypeById);

/**
 * @swagger
 * /vehicles/types:
 *   post:
 *     summary: เพิ่มประเภทรถ
 *     tags: [Vehicle Types]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: รถเก๋ง
 *     responses:
 *       201:
 *         description: เพิ่มสำเร็จ
 */
router.post("/types", ctrl.createType);

/**
 * @swagger
 * /vehicles/types/{id}:
 *   put:
 *     summary: แก้ไขประเภทรถ
 *     tags: [Vehicle Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{32}$'
 *           example: '5fb512404a0011f08325fe6471b6f9ca'
 *         required: true
 *         description: ID ของประเภทรถ (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: รถกระบะ
 *     responses:
 *       200:
 *         description: แก้ไขสำเร็จ
 */
router.put("/types/:id", ctrl.updateType);

/**
 * @swagger
 * /vehicles/types/{id}:
 *   delete:
 *     summary: ลบประเภทรถ
 *     tags: [Vehicle Types]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{32}$'
 *           example: '5fb512404a0011f08325fe6471b6f9ca'
 *         required: true
 *         description: ID ของประเภทรถ (UUID)
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 */
router.delete("/types/:id", ctrl.deleteType);

// ------------------------------------ Vehicle Brands ------------------------------------

/**
 * @swagger
 * /vehicles/brands:
 *   get:
 *     summary: รายการยี่ห้อรถ
 *     tags: [Vehicle Brands]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/brands", ctrl.listBrands);

/**
 * @swagger
 * /vehicles/brands/{id}:
 *   get:
 *     summary: รายละเอียดยี่ห้อรถ
 *     tags: [Vehicle Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{32}$'
 *           example: '5fb72f954a0011f08325fe6471b6f9ca'
 *         description: ID ของยี่ห้อรถ (UUID)
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/brands/:id", ctrl.getBrandById);

/**
 * @swagger
 * /vehicles/brands:
 *   post:
 *     summary: สร้างยี่ห้อรถใหม่
 *     tags: [Vehicle Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Toyota
 *     responses:
 *       201:
 *         description: สำเร็จ
 */
router.post("/brands", ctrl.createBrand);

/**
 * @swagger
 * /vehicles/brands/{id}:
 *   put:
 *     summary: แก้ไขยี่ห้อรถ
 *     tags: [Vehicle Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{32}$'
 *           example: '5fb72f954a0011f08325fe6471b6f9ca'
 *         description: ID ของยี่ห้อรถ (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Toyota
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.put("/brands/:id", ctrl.updateBrand);

/**
 * @swagger
 * /vehicles/brands/{id}:
 *   delete:
 *     summary: ลบยี่ห้อรถ
 *     tags: [Vehicle Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{32}$'
 *           example: '5fb72f954a0011f08325fe6471b6f9ca'
 *         description: ID ของยี่ห้อรถ (UUID)
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.delete("/brands/:id", ctrl.deleteBrand);

// --------------------------------------- Vehicle ------------------------------------

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: รายละเอียดรถ
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{32}$'
 *           example: '4a5464e929124739c30aa10330b6712'
 *     description: ID ของรถ (UUID)
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/:id", ctrl.getById);

// CRUD vehicles

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: รายการรถทั้งหมด
 *     tags: [Vehicles]
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.get("/", ctrl.list);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: สร้างรถใหม่
 *     tags: [Vehicles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               license_plate:
 *                 type: string
 *                 example: 1กก 1234
 *               type_id:
 *                 type: string
 *                 pattern: '^[a-f0-9]{32}$'
 *                 example: '5fb512404a0011f08325fe6471b6f9ca'
 *               brand_id:
 *                 type: string
 *                 pattern: '^[a-f0-9]{32}$'
 *                 example: '5fb72f954a0011f08325fe6471b6f9ca'
 *               capacity:
 *                 type: integer
 *                 example: 4
 *               color:
 *                 type: string
 *                 example: แดง
 *               description:
 *                 type: string
 *                 example: รถกระบะ CAB 2 แดง
 *               image_path:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               is_public:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: สำเร็จ
 */
router.post("/", ctrl.create);

/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: แก้ไขรายละเอียดรถ
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{32}$'
 *           example: '4a5464e929124739c30aa10330b6712'
 *     description: ID ของรถ (UUID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               license_plate:
 *                 type: string
 *                 example: 1กก 1234
 *               type_id:
 *                 type: string
 *                 pattern: '^[a-f0-9]{32}$'
 *                 example: '5fb512404a0011f08325fe6471b6f9ca'
 *               brand_id:
 *                 type: string
 *                 pattern: '^[a-f0-9]{32}$'
 *                 example: '5fb72f954a0011f08325fe6471b6f9ca'
 *               capacity:
 *                 type: integer
 *                 example: 4
 *               color:
 *                 type: string
 *                 example: แดง
 *               description:
 *                 type: string
 *                 example: รถกระบะ CAB 2 แดง
 *               image_path:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *               is_public:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.put("/:id", ctrl.update);

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: ลบรถ
 *     tags: [Vehicles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           pattern: '^[a-f0-9]{32}$'
 *           example: '4a5464e929124739c30aa10330b6712'
 *     description: ID ของรถ (UUID)
 *     responses:
 *       200:
 *         description: สำเร็จ
 */
router.delete("/:id", ctrl.remove);

module.exports = router;
