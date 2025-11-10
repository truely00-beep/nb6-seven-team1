// src/routes/group.routes.js
import express from "express";
import { groupController } from "../controllers/group.controller.js"; // ✅ 경로 확인
const router = express.Router();
router.get("/", groupController.getGroupList);
export default router;
