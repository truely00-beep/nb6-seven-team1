// src/services/record.service.js

const prisma = require("../config/db");

// 💡 헬퍼 함수: 주간(7일) 시작 날짜 계산
const getWeeklyStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  date.setHours(0, 0, 0, 0);
  return date;
};

// 💡 헬퍼 함수: 월간(30일) 시작 날짜 계산
const getMonthlyStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  date.setHours(0, 0, 0, 0);
  return date;
};

/**
 * 주어진 기간 동안의 기록을 기반으로 그룹 랭킹을 계산합니다.
 */
const getGroupRanking = async (groupId, startDate, skip, take) => {
  // 💡 Prisma groupBy를 사용하여 userId별 기록을 집계합니다.
  const rankingResults = await prisma.record.groupBy({
    by: ["userId"],
    where: { groupId: groupId, createdAt: { gte: startDate } }, // 기간 필터링
    _sum: { timeInSeconds: true }, // 누적 시간 합산
    _count: { id: true }, // 기록 횟수 카운트

    orderBy: { _count: { id: "desc" } }, // 기록 횟수 순으로 정렬
    skip: skip,
    take: take,
  });

  // 닉네임 조인 (userId로 닉네임을 찾음)
  const userIds = rankingResults.map((rank) => rank.userId);
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, nickname: true },
  });
  const userMap = new Map(users.map((u) => [u.id, u.nickname]));

  // 결과 포맷팅
  return rankingResults.map((rank) => ({
    nickname: userMap.get(rank.userId),
    recordCount: rank._count.id,
    totalTimeSeconds: rank._sum.timeInSeconds,
  }));
};

const getWeeklyRanking = (groupId, skip, take) => {
  return getGroupRanking(groupId, getWeeklyStartDate(), skip, take);
};

const getMonthlyRanking = (groupId, skip, take) => {
  return getGroupRanking(groupId, getMonthlyStartDate(), skip, take);
};

module.exports = {
  getWeeklyRanking,
  getMonthlyRanking,
};

