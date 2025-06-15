// routes/vehicleRoutes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const ctrl    = require('../controllers/vehicleController');

// ปกป้องทุกเส้นทางด้วย JWT middleware
router.use(auth);

// CRUD Vehicles
router.get( '/',        ctrl.list );       // ดึงรายการทั้งหมด
router.get( '/:id',     ctrl.getById );    // ดึงรถตาม ID
router.post('/',        ctrl.create );     // สร้างรถใหม่
router.put( '/:id',     ctrl.update );     // แก้ไขรถ
router.delete('/:id',   ctrl.remove );     // ลบรถ

module.exports = router;
