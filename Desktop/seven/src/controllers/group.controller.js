// src/controllers/group.controller.js

const {
  getWeeklyRanking,
  getMonthlyRanking,
} = require("../services/record.service");
// const { getGroupList } = require('../services/group.service'); // 다른 서비스도 필요할 수 있음

const DEFAULT_LIMIT = 10;

class GroupController {
  /**
   * GET /api/groups/:groupId/ranking - 랭킹 조회 메서드 추가
   */
  getRanking = async (req, res, next) => {
    const { groupId } = req.params;
    const { type = "weekly", page = 1, limit = DEFAULT_LIMIT } = req.query;

    const take = parseInt(limit, 10);
    const skip = (parseInt(page, 10) - 1) * take;

    try {
      let rankingData;

      // 💡 기간 타입에 따라 서비스 호출 분기
      if (type === "monthly") {
        rankingData = await getMonthlyRanking(groupId, skip, take);
      } else if (type === "weekly") {
        rankingData = await getWeeklyRanking(groupId, skip, take);
      } else {
        return res
          .status(400)
          .json({
            success: false,
            message: "랭킹 타입은 weekly 또는 monthly여야 합니다.",
          });
      }

      res.status(200).json({
        success: true,
        message: `${groupId}의 ${type} 랭킹 조회 성공`,
        ranking: rankingData,
      });
    } catch (error) {
      // Global Error Handler로 에러 전달
      next(error);
    }
  };

  // ... 다른 그룹 관련 컨트롤러 메서드 (getGroupList 등) ...
}

module.exports = new GroupController();
