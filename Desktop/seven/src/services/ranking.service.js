// src/services/ranking.service.js

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class RankingService {
  async getRankingData(startDate, endDate) {
    // ... (ORM 고급 활용 쿼리 로직 복구)
    const rankingsByAuthor = await prisma.record.groupBy({
      // ... 쿼리 내용 생략 ...
    });

    // 닉네임 매핑 로직 포함
    // ... (생략) ...

    return rankingsByAuthor.map((ranking) => ({
      /* ... */
    }));
  }
}
export const rankingService = new RankingService();
