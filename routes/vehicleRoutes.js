// routes/vehicleRoutes.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const ctrl    = require('../controllers/vehicleController');

router.use(auth);


// Vehicle Types
router.get('/types', ctrl.listTypes);
router.get('/types/:id', ctrl.getTypeById);
router.post('/types', ctrl.createType);
router.put('/types/:id', ctrl.updateType);
router.delete('/types/:id', ctrl.deleteType);

// Vehicle Brands
router.get('/brands', ctrl.listBrands);
router.get('/brands/:id', ctrl.getBrandById);
router.post('/brands', ctrl.createBrand);
router.put('/brands/:id', ctrl.updateBrand);
router.delete('/brands/:id', ctrl.deleteBrand);


// ตามด้วย route ที่มี :id (ซึ่งจับได้ทุกอย่าง)
router.get('/:id', ctrl.getById);

// CRUD vehicles
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

module.exports = router;
