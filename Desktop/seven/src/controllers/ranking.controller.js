// src/controllers/ranking.controller.js

// NOTE: 상대 경로를 정확히 지정합니다.
import { rankingService } from "../services/ranking.service.js";
import {
  getStartOfWeek,
  getNextStartOfWeek,
  getStartOfMonth,
  getNextStartOfMonth,
} from "../utils/date.js";

class RankingController {
  /**
   * 📅 주간 랭킹 조회 핸들러: GET /api/ranking/weekly
   */
  getWeeklyRanking = async (req, res, next) => {
    try {
      const today = new Date();
      const startDate = getStartOfWeek(today);
      const endDate = getNextStartOfWeek(today);

      const rankingList = await rankingService.getRankingData(
        startDate,
        endDate
      );

      res.status(200).json({
        message: "주간 랭킹 조회 성공",
        data: rankingList,
      });
    } catch (error) {
      next(error); // Global Error Handler로 전달
    }
  };

  /**
   * 🗓️ 월간 랭킹 조회 핸들러: GET /api/ranking/monthly
   */
  getMonthlyRanking = async (req, res, next) => {
    try {
      const today = new Date();
      const startDate = getStartOfMonth(today);
      const endDate = getNextStartOfMonth(today);

      const rankingList = await rankingService.getRankingData(
        startDate,
        endDate
      );

      res.status(200).json({
        message: "월간 랭킹 조회 성공",
        data: rankingList,
      });
    } catch (error) {
      next(error); // Global Error Handler로 전달
    }
  };
}

export const rankingController = new RankingController();
