// src/utils/date.js

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

export const getStartOfWeek = (today) => {
  const d = startOfDay(today);
  const dayOfWeek = d.getDay();
  d.setDate(d.getDate() - dayOfWeek);
  return d;
};

export const getNextStartOfWeek = (today) => {
  const start = getStartOfDay(today);
  const nextWeek = new Date(start);
  nextWeek.setDate(start.getDate() + 7);
  return nextWeek;
};

export const getStartOfMonth = (today) => {
  const d = new Date(today.getFullYear(), today.getMonth(), 1);
  return startOfDay(d);
};

export const getNextStartOfMonth = (today) => {
  const d = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  return startOfDay(d);
};
