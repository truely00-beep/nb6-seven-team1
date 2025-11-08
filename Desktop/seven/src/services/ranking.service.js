// src/services/ranking.service.js

import { PrismaClient } from "@prisma/client";
// NOTE: 실제 프로젝트에서는 config/db.js 등에서 인스턴스를 가져와야 합니다.
const prisma = new PrismaClient();

class RankingService {
  /**
   * 특정 기간 동안의 운동 기록을 기반으로 닉네임별 랭킹 데이터를 조회합니다.
   */
  async getRankingData(startDate, endDate) {
    // 1. Prisma ORM groupBy를 사용하여 횟수와 시간 합산 (ORM 고급 활용)
    const rankingsByAuthor = await prisma.record.groupBy({
      by: ["authorId"],
      _count: {
        id: true, // 기록 횟수
      },
      _sum: {
        time: true, // 누적 시간
      },
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: {
        _count: {
          id: "desc", // 기록 횟수 기준 내림차순 정렬
        },
      },
    });

    if (rankingsByAuthor.length === 0) {
      return [];
    }

    // 2. 닉네임 조회를 위한 authorId 목록 추출
    const authorIds = rankingsByAuthor.map((r) => r.authorId);
    const participants = await prisma.participant.findMany({
      where: { id: { in: authorIds } },
      select: { id: true, nickname: true },
    });
    const nicknameMap = new Map(participants.map((p) => [p.id, p.nickname]));

    // 3. 최종 결과 형식으로 변환 및 닉네임 매핑
    const rankingList = rankingsByAuthor.map((ranking) => ({
      nickname: nicknameMap.get(ranking.authorId) || "Unknown",
      recordCount: ranking._count.id,
      totalTime: ranking._sum.time || 0,
    }));

    return rankingList.filter((r) => r.nickname !== "Unknown");
  }
}

// Named Export 방식으로 인스턴스를 내보냅니다.
export const rankingService = new RankingService();
