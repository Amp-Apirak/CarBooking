// routes/rolePermissionRoutes.js
const express = require("express");
const router = express.Router();
const rolePermissionController = require("../controllers/rolePermissionController");

router.post("/assign", rolePermissionController.assignPermission);
router.post("/remove", rolePermissionController.removePermission);

module.exports = router;
