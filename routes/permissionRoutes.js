// routes/permissionRoutes.js
const express = require('express');
const router = express.Router();
const permissionController = require('../controllers/permissionController');

// GET /permissions - List all permissions
router.get('/', permissionController.list);

// POST /permissions - Create new permission
router.post('/', permissionController.create);


module.exports = router;