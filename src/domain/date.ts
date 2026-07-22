/**
 * Shared civil-date helpers for backend and frontend.
 * Timezone: Europe/Paris. Weekday: JS 0=Sunday … 6=Saturday.
 */
import type { Weekday } from "../enums/index.js";
import type { IsoDate, IsoDateTime, IsoTime } from "../primitives/zod.js";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export const APP_TZ = "Europe/Paris";//TODO should come from env

dayjs.tz.setDefault(APP_TZ);

export const now = () => dayjs().tz(APP_TZ);

export const startOfDay = (d: string | Date | dayjs.Dayjs) =>
  dayjs.tz(d, APP_TZ).startOf("day");

export const endOfDay = (d: string | Date | dayjs.Dayjs) =>
  dayjs.tz(d, APP_TZ).endOf("day");

export const toIsoDateTime = (
  value: Date | string | null | undefined,
): IsoDateTime => {
  if (value == null) return new Date(0).toISOString() as IsoDateTime;
  const d = dayjs(value);
  if (!d.isValid()) return String(value) as IsoDateTime;
  return d.utc().toISOString() as IsoDateTime;
};

export const toOptionalIsoDateTime = (
  value: Date | string | null | undefined,
): IsoDateTime | undefined => {
  if (value == null) return undefined;
  return toIsoDateTime(value);
};

/** Calendar YYYY-MM-DD in Europe/Paris. */
export const toIsoDate = (
  value: Date | string | null | undefined,
): IsoDate => {
  if (value == null) return "1970-01-01" as IsoDate;
  const d = dayjs.tz(value, APP_TZ);
  if (!d.isValid()) return String(value).slice(0, 10) as IsoDate;
  return d.format("YYYY-MM-DD") as IsoDate;
};

/** Clock HH:mm in Europe/Paris (seconds ignored). */
export const toIsoTime = (
  value: Date | string | null | undefined,
): IsoTime => {
  if (value == null) return "00:00" as IsoTime;
  if (typeof value === "string" && /^\d{2}:\d{2}/.test(value)) {
    return value.slice(0, 5) as IsoTime;
  }
  const d = dayjs.tz(value, APP_TZ);
  if (!d.isValid()) return "00:00" as IsoTime;
  return d.format("HH:mm") as IsoTime;
};

/** JS weekday 0=Sunday … 6=Saturday in Europe/Paris. */
export const weekday = (d: string | Date | dayjs.Dayjs): Weekday =>
  dayjs.tz(d, APP_TZ).day() as Weekday;

/**
 * Next occurrence of weekday n in Europe/Paris
 * (starts searching from tomorrow so “today” is never returned).
 */
export const dateFromWeekday = (n: Weekday): Date => {
  let d = now().startOf("day");
  for (let i = 0; i < 7; i++) {
    d = d.add(1, "day");
    if (d.day() === n) return d.toDate();
  }
  throw new Error(`Invalid weekday ${n}`);
};

/** Combine a calendar date (or Date) with HH:mm in Europe/Paris. */
export const combineDateAndTime = (
  date: string | Date | dayjs.Dayjs,
  isoTime: string,
): Date => {
  const base = dayjs.tz(date, APP_TZ).startOf("day");
  const [h, m] = isoTime.slice(0, 5).split(":").map(Number);
  return base
    .hour(h ?? 0)
    .minute(m ?? 0)
    .second(0)
    .millisecond(0)
    .toDate();
};

/** Monday-first sort key: Mon=0 … Sun=6. */
export const weekdaySortKey = (n: Weekday): number => (n + 6) % 7;

//TODO should not exist, front gen based on its locale
/** French labels for display (UI only — not API wire values). */
export const WEEKDAY_LABELS_FR: Record<Weekday, string> = {
  0: "Dimanche",
  1: "Lundi",
  2: "Mardi",
  3: "Mercredi",
  4: "Jeudi",
  5: "Vendredi",
  6: "Samedi",
};

/** Monday-first order for pickers: 1,2,3,4,5,6,0 */
export const WEEKDAYS_MONDAY_FIRST: Weekday[] = [1, 2, 3, 4, 5, 6, 0];

export { dayjs };
