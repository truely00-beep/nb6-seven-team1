// src/controllers/ranking.controller.js

import { rankingService } from "../services/ranking.service.js"; // ✅ 경로 확인
import {
  getStartOfWeek,
  getNextStartOfWeek,
  getStartOfMonth,
  getNextStartOfMonth,
} from "../utils/date.js"; // ✅ 경로 확인

class RankingController {
  getWeeklyRanking = async (req, res, next) => {
    // ... 핸들러 로직 복구 ...
    const rankingList = await rankingService.getRankingData(startDate, endDate);
    res.status(200).json({ message: "주간 랭킹 조회 성공", data: rankingList });
  };
  // ... (월간 핸들러 복구)
}
export const rankingController = new RankingController();
