// routes/approvalStepRoutes.js

const express = require("express");
const router = express.Router();

const stepController = require("../controllers/approvalStepController");

// เพิ่มขั้นตอนใน flow
router.post("/:flow_id/steps", stepController.createStep);

// ดึงขั้นตอนทั้งหมดของ flow
router.get("/:flow_id/steps", stepController.getStepsByFlow);

// ลบทุกขั้นตอนของ flow
router.delete("/:flow_id/steps", stepController.deleteStepsByFlow);

module.exports = router;
