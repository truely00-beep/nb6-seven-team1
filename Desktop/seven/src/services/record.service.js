// src/services/record.service.js (권장 구조)

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

class RecordService {
  // ⬇️ 파라미터 추가 (정렬, 검색, 페이지네이션 지원)
  async getRecords({ limit = 10, offset = 0, sortBy = "latest", search = "" }) {
    // ⚠️ 여기에 실제 ORM 쿼리 로직이 들어갑니다.
    // 이 로직은 sortBy, search, limit/offset을 사용해야 합니다.

    const records = await prisma.record.findMany({
      // 예시: orderBy, where 조건 추가
      // orderBy: { time: sortBy === 'time' ? 'desc' : undefined, createdAt: sortBy === 'latest' ? 'desc' : undefined },
      // take: limit, skip: offset,
    });

    return records;
  }
}

export const recordService = new RecordService();
