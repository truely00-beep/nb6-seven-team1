// src/routes/ranking.routes.js

import express from "express";
// NOTE: 상대 경로를 정확히 지정합니다.
import { rankingController } from "../controllers/ranking.controller.js";

const router = express.Router();

/**
 * 랭킹 관련 API 엔드포인트
 */
router.get("/weekly", rankingController.getWeeklyRanking);
router.get("/monthly", rankingController.getMonthlyRanking);

export default router;
