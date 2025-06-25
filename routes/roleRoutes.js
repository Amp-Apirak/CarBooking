// routes/roleRoutes.js
const express = require("express");
const router = express.Router();

const roleController = require("../controllers/roleController");

// ดึงบทบาททั้งหมด
router.get("/", roleController.listRoles); // GET /api/roles
// สร้างบทบาทใหม่
router.post("/", roleController.create); // POST /api/roles

module.exports = router;
