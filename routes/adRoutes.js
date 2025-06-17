const express = require('express');
const router = express.Router();
const { changeAdPassword } = require('../controllers/adController');

router.post('/change-password', changeAdPassword);

module.exports = router;
