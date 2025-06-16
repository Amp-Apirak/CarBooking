const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { login, register, refresh, logout, ldapLogin } = require('../controllers/authController');


router.post('/register', register);
router.post('/login',    login);

// สร้างเส้นทางสำหรับ LDAP Authentication
router.post('/login/ldap', ldapLogin);


router.post('/token/refresh', refresh);         // ขอ access ใหม่
router.post('/logout',       auth, logout);    // เพิกถอนทั้ง access + refresh

module.exports = router;
