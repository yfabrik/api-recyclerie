import { describe, expect, it } from "vitest";

import {
  TIME_RANGE_MIN_MINUTES,
  TIME_RANGE_STEP_MINUTES,
  clampRangeToWindow,
  clipWindow,
  minutesToTime,
  nearestWindow,
  overlap,
  subtractWindows,
  timeToMinutes,
} from "../src/domain/timeRange.js";

describe("constants", () => {
  it("uses a 15-minute grid and minimum", () => {
    expect(TIME_RANGE_STEP_MINUTES).toBe(15);
    expect(TIME_RANGE_MIN_MINUTES).toBe(15);
  });
});

describe("HH:MM <-> minutes", () => {
  it("converts wire times to minutes since midnight", () => {
    expect(timeToMinutes("00:00")).toBe(0);
    expect(timeToMinutes("09:30")).toBe(570);
    expect(timeToMinutes("23:59")).toBe(1439);
  });

  it("ignores seconds, as a TIME column may serialise them", () => {
    expect(timeToMinutes("10:15:00")).toBe(615);
  });

  it("converts minutes back to zero-padded wire times", () => {
    expect(minutesToTime(0)).toBe("00:00");
    expect(minutesToTime(570)).toBe("09:30");
    expect(minutesToTime(1439)).toBe("23:59");
  });

  it("rejects malformed times and out-of-day minutes", () => {
    expect(() => timeToMinutes("9:30")).toThrow(RangeError);
    expect(() => timeToMinutes("25:00")).toThrow(RangeError);
    expect(() => timeToMinutes("10:60")).toThrow(RangeError);
    expect(() => minutesToTime(-1)).toThrow(RangeError);
    expect(() => minutesToTime(1440)).toThrow(RangeError);
    expect(() => minutesToTime(10.5)).toThrow(RangeError);
  });
});

const h = (hours: number, minutes = 0) => hours * 60 + minutes;

describe("clipWindow", () => {
  it("keeps the part of the inner window inside the outer one", () => {
    expect(clipWindow({ start: h(8), end: h(12) }, { start: h(10), end: h(18) })).toEqual({
      start: h(10),
      end: h(12),
    });
  });

  it("returns null when the windows only touch or are apart", () => {
    expect(clipWindow({ start: h(8), end: h(10) }, { start: h(10), end: h(12) })).toBeNull();
    expect(clipWindow({ start: h(8), end: h(9) }, { start: h(10), end: h(12) })).toBeNull();
  });
});

describe("overlap", () => {
  it("returns the shared part of two windows", () => {
    expect(overlap({ start: h(9), end: h(11) }, { start: h(10), end: h(12) })).toEqual({
      start: h(10),
      end: h(11),
    });
  });

  it("treats touching windows as not overlapping", () => {
    expect(overlap({ start: h(10), end: h(11) }, { start: h(11), end: h(12) })).toBeNull();
  });

  it("reports an overlap even when it is shorter than the minimum range", () => {
    expect(overlap({ start: h(10), end: h(10, 10) }, { start: h(10, 5), end: h(11) })).toEqual({
      start: h(10, 5),
      end: h(10, 10),
    });
  });
});

describe("subtractWindows", () => {
  it("cuts holes out of a window", () => {
    expect(
      subtractWindows({ start: h(8), end: h(18) }, [
        { start: h(10), end: h(11) },
        { start: h(14), end: h(15) },
      ]),
    ).toEqual([
      { start: h(8), end: h(10) },
      { start: h(11), end: h(14) },
      { start: h(15), end: h(18) },
    ]);
  });

  it("ignores holes outside the window and returns the window untouched", () => {
    expect(
      subtractWindows({ start: h(8), end: h(10) }, [{ start: h(12), end: h(13) }]),
    ).toEqual([{ start: h(8), end: h(10) }]);
  });

  it("drops leftovers shorter than the minimum range", () => {
    expect(
      subtractWindows({ start: h(8), end: h(10) }, [{ start: h(8, 10), end: h(10) }]),
    ).toEqual([]);
  });

  it("returns nothing when a hole covers the whole window", () => {
    expect(
      subtractWindows({ start: h(9), end: h(10) }, [{ start: h(8), end: h(11) }]),
    ).toEqual([]);
  });
});

describe("nearestWindow", () => {
  const windows = [
    { start: h(8), end: h(12) },
    { start: h(14), end: h(18) },
  ];

  it("returns the window containing the minute", () => {
    expect(nearestWindow(windows, h(9))).toEqual(windows[0]);
    expect(nearestWindow(windows, h(15))).toEqual(windows[1]);
  });

  it("returns the closest window when the minute is in a gap", () => {
    expect(nearestWindow(windows, h(12, 30))).toEqual(windows[0]);
    expect(nearestWindow(windows, h(13, 30))).toEqual(windows[1]);
  });

  it("returns undefined when there are no windows", () => {
    expect(nearestWindow([], h(9))).toBeUndefined();
  });
});

describe("clampRangeToWindow", () => {
  const window = { start: h(9), end: h(12) };

  it("leaves a range inside the window unchanged", () => {
    expect(clampRangeToWindow([h(10), h(11)], window)).toEqual([h(10), h(11)]);
  });

  it("trims a range that sticks out on either side", () => {
    expect(clampRangeToWindow([h(8), h(10)], window)).toEqual([h(9), h(10)]);
    expect(clampRangeToWindow([h(11), h(13)], window)).toEqual([h(11), h(12)]);
  });

  it("grows a range squeezed below the minimum back to the minimum inside the window", () => {
    expect(clampRangeToWindow([h(7), h(9, 5)], window)).toEqual([h(9), h(9, 15)]);
    expect(clampRangeToWindow([h(13), h(14)], window)).toEqual([h(11, 45), h(12)]);
  });

  it("returns null when the window is shorter than the minimum", () => {
    expect(clampRangeToWindow([h(9), h(10)], { start: h(9), end: h(9, 10) })).toBeNull();
  });
});
