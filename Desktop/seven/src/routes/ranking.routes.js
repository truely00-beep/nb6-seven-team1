// src/routes/ranking.routes.js

import express from "express";
import { rankingController } from "../controllers/ranking.controller.js"; // ✅ 경로 확인

const router = express.Router();
router.get("/weekly", rankingController.getWeeklyRanking);
router.get("/monthly", rankingController.getMonthlyRanking);

export default router;
