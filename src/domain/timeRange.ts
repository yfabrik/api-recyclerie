/**
 * Time range arithmetic shared by backend and frontend.
 * Windows are expressed in minutes since midnight; `"HH:MM"` is the wire format.
 */
import type { IsoTime } from "../primitives/zod.js";

export const TIME_RANGE_STEP_MINUTES = 15;
export const TIME_RANGE_MIN_MINUTES = 15;

const WIRE_TIME = /^(\d{2}):(\d{2})(?::\d{2})?$/;

/** `"HH:MM"` (seconds tolerated and ignored) to minutes since midnight. */
export function timeToMinutes(value: string): number {
  const match = WIRE_TIME.exec(value);
  const hours = Number(match?.[1]);
  const minutes = Number(match?.[2]);
  if (!match || hours > 23 || minutes > 59) {
    throw new RangeError(`Invalid time "${value}", expected HH:MM`);
  }
  return hours * 60 + minutes;
}

/** Minutes since midnight (0-1439) to `"HH:MM"`. */
export function minutesToTime(value: number): IsoTime {
  if (!Number.isInteger(value) || value < 0 || value > 24 * 60 - 1) {
    throw new RangeError(`Invalid minutes since midnight: ${value}`);
  }
  const hours = String(Math.floor(value / 60)).padStart(2, "0");
  const minutes = String(value % 60).padStart(2, "0");
  return `${hours}:${minutes}` as IsoTime; // brand at the trusted boundary
}

/** Half-open window `[start, end)` in minutes since midnight. */
export interface MinuteWindow {
  start: number;
  end: number;
}

/** Slider-style `[start, end]` pair, same units as {@link MinuteWindow}. */
export type MinuteRange = readonly [start: number, end: number];

/** Part of `inner` that lies inside `outer`, or null if they share no time. */
export function clipWindow(
  inner: MinuteWindow,
  outer: MinuteWindow,
): MinuteWindow | null {
  const start = Math.max(inner.start, outer.start);
  const end = Math.min(inner.end, outer.end);
  if (end <= start) return null;
  return { start, end };
}

/** Time shared by two windows. Windows that merely touch do not overlap. */
export function overlap(a: MinuteWindow, b: MinuteWindow): MinuteWindow | null {
  return clipWindow(a, b);
}

/** `source` minus every hole, leaving only parts of at least the minimum range length. */
export function subtractWindows(
  source: MinuteWindow,
  holes: readonly MinuteWindow[],
): MinuteWindow[] {
  let parts: MinuteWindow[] = [source];
  for (const hole of holes) {
    const next: MinuteWindow[] = [];
    for (const part of parts) {
      const cut = clipWindow(hole, part);
      if (!cut) {
        next.push(part);
        continue;
      }
      if (cut.start > part.start) next.push({ start: part.start, end: cut.start });
      if (cut.end < part.end) next.push({ start: cut.end, end: part.end });
    }
    parts = next;
  }
  return parts.filter((part) => part.end - part.start >= TIME_RANGE_MIN_MINUTES);
}

/** The window containing `minute`, else the one whose edge is closest. */
export function nearestWindow(
  windows: readonly MinuteWindow[],
  minute: number,
): MinuteWindow | undefined {
  const distanceTo = (window: MinuteWindow) =>
    Math.min(Math.abs(minute - window.start), Math.abs(minute - window.end));

  const containing = windows.find(
    (window) => minute >= window.start && minute <= window.end,
  );
  if (containing) return containing;
  return windows.reduce<MinuteWindow | undefined>(
    (best, window) => (!best || distanceTo(window) < distanceTo(best) ? window : best),
    undefined,
  );
}

/**
 * Fits `range` into `window`. A range left shorter than the minimum is grown
 * back to the minimum inside the window; null if the window itself is too short.
 */
export function clampRangeToWindow(
  range: MinuteRange,
  window: MinuteWindow,
): [start: number, end: number] | null {
  let start = Math.max(range[0], window.start);
  let end = Math.min(range[1], window.end);
  if (end - start < TIME_RANGE_MIN_MINUTES) {
    if (window.end - window.start < TIME_RANGE_MIN_MINUTES) return null;
    start = Math.min(start, window.end - TIME_RANGE_MIN_MINUTES);
    end = start + TIME_RANGE_MIN_MINUTES;
  }
  return [start, end];
}

export const TIME_RANGE_VIOLATIONS = [
  "too-short",
  "off-grid",
  "outside-task",
  "outside-workday",
  "overlaps-other-range",
] as const;

export type TimeRangeViolation = (typeof TIME_RANGE_VIOLATIONS)[number];

export type TimeRangeCheck = { ok: true } | { ok: false; reason: TimeRangeViolation };

/** User-facing reasons, usable as-is for 409 messages. */
export const TIME_RANGE_VIOLATION_MESSAGES = {
  "too-short": `La plage horaire doit durer au moins ${TIME_RANGE_MIN_MINUTES} minutes.`,
  "off-grid": `La plage horaire doit commencer et finir sur un multiple de ${TIME_RANGE_STEP_MINUTES} minutes.`,
  "outside-task": "La plage horaire doit rester dans les horaires de la tâche.",
  "outside-workday": "La plage horaire doit rester dans les horaires de travail de l'employé.",
  "overlaps-other-range": "La plage horaire chevauche une autre plage horaire de l'employé.",
} as const satisfies Record<TimeRangeViolation, string>;

/** What a candidate range is checked against, all in minutes for a single day. */
export interface TimeRangeContext {
  /** Time of day of the Task. */
  task: MinuteWindow;
  /** The Employee's Workday hours for that day and week. */
  workWindows: readonly MinuteWindow[];
  /** The Employee's other ranges that day, across every Task (excluding the one being checked). */
  otherRanges: readonly MinuteWindow[];
}

/** Sorts windows and joins those that overlap or touch. */
function mergeWindows(windows: readonly MinuteWindow[]): MinuteWindow[] {
  const merged: MinuteWindow[] = [];
  for (const window of [...windows].sort((a, b) => a.start - b.start)) {
    const last = merged[merged.length - 1];
    if (last && window.start <= last.end) {
      last.end = Math.max(last.end, window.end);
    } else {
      merged.push({ ...window });
    }
  }
  return merged;
}

const isOnGrid = (minute: number) => minute % TIME_RANGE_STEP_MINUTES === 0;

const contains = (outer: MinuteWindow, inner: MinuteWindow) =>
  outer.start <= inner.start && inner.end <= outer.end;

/** Checks a candidate range, returning the first rule it breaks. */
export function validateTimeRange(
  range: MinuteWindow,
  context: TimeRangeContext,
): TimeRangeCheck {
  if (range.end - range.start < TIME_RANGE_MIN_MINUTES) {
    return { ok: false, reason: "too-short" };
  }
  if (!isOnGrid(range.start) || !isOnGrid(range.end)) {
    return { ok: false, reason: "off-grid" };
  }
  if (!contains(context.task, range)) {
    return { ok: false, reason: "outside-task" };
  }
  if (!mergeWindows(context.workWindows).some((window) => contains(window, range))) {
    return { ok: false, reason: "outside-workday" };
  }
  if (context.otherRanges.some((other) => overlap(other, range))) {
    return { ok: false, reason: "overlaps-other-range" };
  }
  return { ok: true };
}

/** Every maximal window, earliest first, in which a valid range can be placed. */
export function assignableWindows(context: TimeRangeContext): MinuteWindow[] {
  return mergeWindows(context.workWindows)
    .map((workWindow) => clipWindow(workWindow, context.task))
    .filter((window) => window !== null)
    .flatMap((window) => subtractWindows(window, context.otherRanges))
    .map((window) => ({
      start: Math.ceil(window.start / TIME_RANGE_STEP_MINUTES) * TIME_RANGE_STEP_MINUTES,
      end: Math.floor(window.end / TIME_RANGE_STEP_MINUTES) * TIME_RANGE_STEP_MINUTES,
    }))
    .filter((window) => window.end - window.start >= TIME_RANGE_MIN_MINUTES)
    .sort((a, b) => a.start - b.start);
}

/** Where to put an Employee on a Task when no range was asked for. */
export function firstFreeWindow(context: TimeRangeContext): MinuteWindow | null {
  return assignableWindows(context)[0] ?? null;
}
