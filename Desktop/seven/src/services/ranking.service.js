// src/services/ranking.service.js

import { PrismaClient } from "@prisma/client";
// PrismaClient 인스턴스를 생성하여 DB 접근 준비
const prisma = new PrismaClient();

class RankingService {
  /**
   * 특정 기간 동안의 운동 기록을 기반으로 닉네임별 랭킹 데이터를 조회합니다.
   * 랭킹 기준: 기록 횟수 (recordCount) 내림차순
   * @param {Date} startDate 랭킹 조회 시작일 (gte)
   * @param {Date} endDate 랭킹 조회 종료일 (lt)
   */
  async getRankingData(startDate, endDate) {
    // 1. Prisma ORM groupBy를 사용하여 횟수와 시간 합산 (ORM 고급 활용)
    const rankingsByAuthor = await prisma.record.groupBy({
      by: ["authorId"], // 작성자 ID별로 그룹화
      _count: {
        id: true, // 기록 횟수 카운트
      },
      _sum: {
        time: true, // 누적 시간 합산
      },
      where: {
        createdAt: {
          gte: startDate, // 기간 시작일 이후
          lt: endDate, // 기간 종료일 이전
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

    // 3. Participant 테이블에서 닉네임 정보 한 번에 조회
    const participants = await prisma.participant.findMany({
      where: { id: { in: authorIds } },
      select: { id: true, nickname: true },
    });

    // 닉네임 매핑을 위한 Map 생성
    const nicknameMap = new Map(participants.map((p) => [p.id, p.nickname]));

    // 4. 최종 결과 형식으로 변환 (닉네임 포함)
    const rankingList = rankingsByAuthor.map((ranking) => ({
      nickname: nicknameMap.get(ranking.authorId) || "Unknown",
      recordCount: ranking._count.id,
      totalTime: ranking._sum.time || 0, // 누적 시간 (초 단위)
    }));

    // 닉네임을 찾을 수 없는 경우는 제외하고 반환
    return rankingList.filter((r) => r.nickname !== "Unknown");
  }
}

// Named Export 방식으로 인스턴스를 내보냅니다.
export const rankingService = new RankingService();
