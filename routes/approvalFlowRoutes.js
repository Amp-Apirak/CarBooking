// routes/approvalFlowRoutes.js

const express = require("express");
const router = express.Router();

const flowController = require("../controllers/approvalFlowController");

// สร้าง flow ใหม่
router.post("/", flowController.createFlow);

// ดึง flow ทั้งหมด
router.get("/", flowController.getAllFlows);

// ดึง flow รายการเดียว
router.get("/:id", flowController.getFlowById);

// ปิดการใช้งาน flow
router.put("/:id/deactivate", flowController.deactivateFlow);

// เปิดการใช้งาน flow
router.put("/:id/activate", flowController.activateFlow);

// ลบ flow (ไม่ลบ step)
router.delete("/:id", flowController.deleteFlow);

module.exports = router;
