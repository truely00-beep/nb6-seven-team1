// src/utils/date.js

/**
 * 시간을 00:00:00.000으로 설정하여 날짜의 시작점을 구합니다.
 * @param {Date} date - 기준 날짜
 * @returns {Date} 해당 날짜의 자정 (00:00:00) Date 객체
 */
const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

/**
 * 📅 현재 날짜를 포함하는 주의 시작일 (일요일)을 계산합니다.
 * @param {Date} today - 기준 날짜
 * @returns {Date} 이번 주 일요일 00:00:00 Date 객체
 */
export const getStartOfWeek = (today) => {
  const d = startOfDay(today);
  const dayOfWeek = d.getDay(); // 0 (일요일) ~ 6 (토요일)

  // 현재 날짜에서 (요일만큼의 날짜)를 빼면 이번 주 일요일이 됩니다.
  d.setDate(d.getDate() - dayOfWeek);
  return d;
};

/**
 * 📅 다음 주의 시작일 (다음 주 일요일)을 계산합니다.
 * (랭킹 조회 시 'lt' 종료일로 사용)
 * @param {Date} today - 기준 날짜
 * @returns {Date} 다음 주 일요일 00:00:00 Date 객체
 */
export const getNextStartOfWeek = (today) => {
  const start = getStartOfWeek(today);
  const nextWeek = new Date(start);
  // 7일을 더하여 다음 주 일요일을 구합니다.
  nextWeek.setDate(start.getDate() + 7);
  return nextWeek;
};

/**
 * 🗓️ 현재 날짜를 포함하는 달의 시작일 (1일)을 계산합니다.
 * @param {Date} today - 기준 날짜
 * @returns {Date} 이번 달 1일 00:00:00 Date 객체
 */
export const getStartOfMonth = (today) => {
  // 년도와 월은 현재와 같고, 일은 1일로 설정합니다.
  const d = new Date(today.getFullYear(), today.getMonth(), 1);
  return startOfDay(d);
};

/**
 * 🗓️ 다음 달의 시작일 (다음 달 1일)을 계산합니다.
 * (랭킹 조회 시 'lt' 종료일로 사용)
 * @param {Date} today - 기준 날짜
 * @returns {Date} 다음 달 1일 00:00:00 Date 객체
 */
export const getNextStartOfMonth = (today) => {
  // 현재 월에 1을 더하면 다음 달이 됩니다.
  const d = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return startOfDay(d);
};
