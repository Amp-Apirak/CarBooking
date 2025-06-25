// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const ctrl = require('../controllers/bookingController');


// ใช้งาน middleware ตรวจสอบ JWT ทุกเส้นทาง
router.use(auth);

// CRUD Bookings
router.get('/', ctrl.list);            // GET /api/bookings
router.get('/:id', ctrl.getById);      // GET /api/bookings/:id
router.post('/', ctrl.create);         // POST /api/bookings
router.put('/:id', ctrl.update);       // PUT /api/bookings/:id
router.delete('/:id', ctrl.remove);    // DELETE /api/bookings/:id
router.post('/:id/approve', ctrl.approveBooking); // POST /api/bookings/:id/approve
router.post('/:id/reject', ctrl.rejectBooking); // POST /api/bookings/:id/reject

module.exports = router;
