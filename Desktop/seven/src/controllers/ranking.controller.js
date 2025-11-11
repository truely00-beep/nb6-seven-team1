// src/controllers/ranking.controller.js (수정 권장)

import { rankingService } from "../services/ranking.service.js";
import {
  getStartOfWeek,
  getNextStartOfWeek,
  getStartOfMonth,
  getNextStartOfMonth,
} from "../utils/date.js";

class RankingController {
  getWeeklyRanking = async (req, res, next) => {
    try {
      // ⬅️ try 블록 시작
      // ⬇️ 누락된 변수 정의
      const today = new Date();
      const startDate = getStartOfWeek(today);
      const endDate = getNextStartOfWeek(today);

      const rankingList = await rankingService.getRankingData(
        startDate,
        endDate
      );
      res
        .status(200)
        .json({ message: "주간 랭킹 조회 성공", data: rankingList });
    } catch (error) {
      // ⬅️ 에러 발생 시 Global Error Handler로 전달
      next(error);
    }
  };

  // ⬇️ 누락된 월간 핸들러 추가
  getMonthlyRanking = async (req, res, next) => {
    try {
      const today = new Date();
      const startDate = getStartOfMonth(today);
      const endDate = getNextStartOfMonth(today);

      const rankingList = await rankingService.getRankingData(
        startDate,
        endDate
      );
      res
        .status(200)
        .json({ message: "월간 랭킹 조회 성공", data: rankingList });
    } catch (error) {
      next(error);
    }
  };
}
export const rankingController = new RankingController();
