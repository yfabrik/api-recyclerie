/**
 * Calendar arithmetic on bare `YYYY-MM-DD` dates, with no time of day and no
 * time zone, so no DST change or process TZ can move a day. Weeks start on
 * Monday. Use `date.ts` to turn a date into Paris instants.
 */
import type { IsoDate } from "../primitives/zod.js";

const DAY_MS = 86_400_000;

const parts = (date: string) => {
  const [y, m, d] = date.slice(0, 10).split("-").map(Number);
  return { y: y ?? 0, m: m ?? 1, d: d ?? 1 };
};

const utcTime = (date: string) => {
  const { y, m, d } = parts(date);
  return Date.UTC(y, m - 1, d);
};

const fromUtcTime = (time: number) =>
  new Date(time).toISOString().slice(0, 10) as IsoDate;

const format = (y: number, m: number, d: number) =>
  fromUtcTime(Date.UTC(y, m - 1, d));

/** Number of days in the date's month. */
export const daysInMonth = (date: string) => {
  const { y, m } = parts(date);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
};

export const addDays = (date: string, days: number): IsoDate =>
  fromUtcTime(utcTime(date) + days * DAY_MS);

/** Adds months, clamping the day to the end of a shorter month (31 Mar − 1 month = 28/29 Feb). */
export const addMonths = (date: string, months: number): IsoDate => {
  const { y, m, d } = parts(date);
  const index = y * 12 + (m - 1) + months;
  const year = Math.floor(index / 12);
  const month = index - year * 12 + 1;
  const last = new Date(Date.UTC(year, month, 0)).getUTCDate();
  return format(year, month, Math.min(d, last));
};

/** Adds years; 29 Feb maps to 28 Feb in a common year. */
export const addYears = (date: string, years: number): IsoDate =>
  addMonths(date, years * 12);

/** `to − from` in days (negative when `to` is earlier). */
export const daysBetween = (from: string, to: string) =>
  Math.round((utcTime(to) - utcTime(from)) / DAY_MS);

export const startOfMonth = (date: string): IsoDate => {
  const { y, m } = parts(date);
  return format(y, m, 1);
};

export const endOfMonth = (date: string): IsoDate => {
  const { y, m } = parts(date);
  return format(y, m, daysInMonth(date));
};

export const isLastDayOfMonth = (date: string) =>
  parts(date).d === daysInMonth(date);

/** The Monday of the date's week. */
export const startOfIsoWeek = (date: string): IsoDate => {
  const sundayFirst = new Date(utcTime(date)).getUTCDay();
  return addDays(date, -((sundayFirst + 6) % 7));
};

/** 1 Jan, 1 Apr, 1 Jul or 1 Oct. */
export const startOfQuarter = (date: string): IsoDate => {
  const { y, m } = parts(date);
  return format(y, Math.floor((m - 1) / 3) * 3 + 1, 1);
};

export const startOfYear = (date: string): IsoDate => format(parts(date).y, 1, 1);
