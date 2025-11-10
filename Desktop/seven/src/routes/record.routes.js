// src/routes/record.routes.js
import express from "express";
import { recordController } from "../controllers/record.controller.js"; // ✅ 경로 확인
const router = express.Router();
router.get("/", recordController.getRecords);
export default router;
