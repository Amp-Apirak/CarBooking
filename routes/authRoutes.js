const express = require('express');
const router = express.Router();
const { login, register, refresh, logout } = require('../controllers/authController');
const auth = require('../middleware/authMiddleware');


router.post('/register', register);
router.post('/login',    login);


router.post('/token/refresh', refresh);         // ขอ access ใหม่
router.post('/logout',       auth, logout);    // เพิกถอนทั้ง access + refresh

module.exports = router;
