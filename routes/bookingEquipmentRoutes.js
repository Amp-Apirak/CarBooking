const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/bookingEquipmentController');

router.use(auth);

// GET /api/bookings/:id/equipments
router.get('/', ctrl.getAll);
// GET /api/bookings/:id/equipments/page
router.get('/page', ctrl.getPaged);
// GET /api/bookings/:id/equipments/:equipId
router.get('/:equipId', ctrl.getById);
// POST /api/bookings/:id/equipments
router.post('/', ctrl.add);
// PUT /api/bookings/:id/equipments/:equipId
router.put('/:equipId', ctrl.update);
// DELETE /api/bookings/:id/equipments/:equipId
router.delete('/:equipId', ctrl.remove);

module.exports = router;