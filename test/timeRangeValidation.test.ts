import { describe, expect, it } from "vitest";

import {
  TIME_RANGE_VIOLATION_MESSAGES,
  assignableWindows,
  firstFreeWindow,
  validateTimeRange,
} from "../src/domain/timeRange.js";

const h = (hours: number, minutes = 0) => hours * 60 + minutes;

describe("validateTimeRange", () => {
  const task = { start: h(9), end: h(13) };
  const fullDay = [{ start: h(8), end: h(18) }];
  const check = (
    range: { start: number; end: number },
    context: Partial<Parameters<typeof validateTimeRange>[1]> = {},
  ) =>
    validateTimeRange(range, {
      task,
      workWindows: fullDay,
      otherRanges: [],
      ...context,
    });

  it("accepts a range on the grid inside the Task and the Workday", () => {
    expect(check({ start: h(10), end: h(11, 15) })).toEqual({ ok: true });
  });

  it("accepts a range covering the whole Task", () => {
    expect(check({ start: h(9), end: h(13) })).toEqual({ ok: true });
  });

  it("accepts a range of exactly the minimum length", () => {
    expect(check({ start: h(10), end: h(10, 15) })).toEqual({ ok: true });
  });

  it("rejects a 14-minute range as too short", () => {
    expect(check({ start: h(10), end: h(10, 14) })).toEqual({
      ok: false,
      reason: "too-short",
    });
  });

  it("rejects an empty or reversed range as too short", () => {
    expect(check({ start: h(10), end: h(10) })).toEqual({ ok: false, reason: "too-short" });
    expect(check({ start: h(11), end: h(10) })).toEqual({ ok: false, reason: "too-short" });
  });

  it("rejects an off-grid start", () => {
    expect(check({ start: h(10, 5), end: h(11) })).toEqual({ ok: false, reason: "off-grid" });
  });

  it("rejects an off-grid end", () => {
    expect(check({ start: h(10), end: h(11, 10) })).toEqual({ ok: false, reason: "off-grid" });
  });

  describe("with a Task that is itself off the grid", () => {
    const offGridTask = { task: { start: h(10, 1), end: h(12, 7) } };

    it("accepts a range covering the whole Task", () => {
      expect(check({ start: h(10, 1), end: h(12, 7) }, offGridTask)).toEqual({ ok: true });
    });

    it("accepts a range starting at the Task's start and ending on the grid", () => {
      expect(check({ start: h(10, 1), end: h(11) }, offGridTask)).toEqual({ ok: true });
    });

    it("accepts a range starting on the grid and ending at the Task's end", () => {
      expect(check({ start: h(10, 30), end: h(12, 7) }, offGridTask)).toEqual({ ok: true });
    });

    it("accepts a range strictly inside the Task, on the grid", () => {
      expect(check({ start: h(10, 15), end: h(11, 45) }, offGridTask)).toEqual({ ok: true });
    });

    it("accepts the short stretch between the Task's start and the next grid line", () => {
      expect(check({ start: h(10, 1), end: h(10, 15) }, offGridTask)).toEqual({ ok: true });
    });

    it("accepts the short stretch between the last grid line and the Task's end", () => {
      expect(check({ start: h(12), end: h(12, 7) }, offGridTask)).toEqual({ ok: true });
    });

    it("accepts a range covering a whole Task shorter than the minimum", () => {
      const tinyTask = { task: { start: h(10, 1), end: h(10, 10) } };
      expect(check({ start: h(10, 1), end: h(10, 10) }, tinyTask)).toEqual({ ok: true });
    });

    it("still rejects a short range in the middle of the Task", () => {
      expect(check({ start: h(11), end: h(11, 10) }, offGridTask)).toEqual({
        ok: false,
        reason: "too-short",
      });
    });

    it("still rejects a short range at the Task's start that does not end on the grid", () => {
      expect(check({ start: h(10, 1), end: h(10, 10) }, offGridTask)).toEqual({
        ok: false,
        reason: "too-short",
      });
    });

    it("still rejects an empty range at the Task's edge", () => {
      expect(check({ start: h(10, 1), end: h(10, 1) }, offGridTask)).toEqual({
        ok: false,
        reason: "too-short",
      });
    });

    it("still rejects an off-grid edge that is not the Task's edge", () => {
      expect(check({ start: h(10, 5), end: h(11) }, offGridTask)).toEqual({
        ok: false,
        reason: "off-grid",
      });
      expect(check({ start: h(10, 1), end: h(11, 10) }, offGridTask)).toEqual({
        ok: false,
        reason: "off-grid",
      });
    });

    it("does not let the Task's start excuse an off-grid end, or the reverse", () => {
      expect(check({ start: h(10, 15), end: h(12, 10) }, offGridTask)).toEqual({
        ok: false,
        reason: "off-grid",
      });
      expect(check({ start: h(10, 4), end: h(12, 7) }, offGridTask)).toEqual({
        ok: false,
        reason: "off-grid",
      });
    });
  });

  it("rejects a range starting before or ending after the Task", () => {
    expect(check({ start: h(8, 45), end: h(10) })).toEqual({ ok: false, reason: "outside-task" });
    expect(check({ start: h(12), end: h(13, 15) })).toEqual({ ok: false, reason: "outside-task" });
  });

  it("rejects a range outside the Workday hours", () => {
    expect(
      check({ start: h(9), end: h(11) }, { workWindows: [{ start: h(10), end: h(18) }] }),
    ).toEqual({ ok: false, reason: "outside-workday" });
  });

  it("rejects a range when the Employee has no Workday hours at all", () => {
    expect(check({ start: h(9), end: h(11) }, { workWindows: [] })).toEqual({
      ok: false,
      reason: "outside-workday",
    });
  });

  describe("with a lunch gap between two work windows", () => {
    const lunchGap = {
      task: { start: h(8), end: h(17) },
      workWindows: [
        { start: h(8), end: h(12) },
        { start: h(13), end: h(17) },
      ],
    };

    it("accepts a range inside either work window", () => {
      expect(check({ start: h(9), end: h(12) }, lunchGap)).toEqual({ ok: true });
      expect(check({ start: h(13), end: h(15) }, lunchGap)).toEqual({ ok: true });
    });

    it("rejects a range that spans the gap", () => {
      expect(check({ start: h(11), end: h(14) }, lunchGap)).toEqual({
        ok: false,
        reason: "outside-workday",
      });
    });

    it("rejects a range inside the gap", () => {
      expect(check({ start: h(12), end: h(13) }, lunchGap)).toEqual({
        ok: false,
        reason: "outside-workday",
      });
    });
  });

  it("accepts a range across two work windows that touch (morning then afternoon)", () => {
    expect(
      check(
        { start: h(11), end: h(13) },
        {
          workWindows: [
            { start: h(8), end: h(12) },
            { start: h(12), end: h(17) },
          ],
        },
      ),
    ).toEqual({ ok: true });
  });

  it("accepts a range that touches other ranges", () => {
    const otherRanges = [
      { start: h(9), end: h(10) },
      { start: h(11), end: h(12) },
    ];
    expect(check({ start: h(10), end: h(11) }, { otherRanges })).toEqual({ ok: true });
  });

  it("rejects a range overlapping another range", () => {
    expect(
      check({ start: h(10), end: h(11) }, { otherRanges: [{ start: h(10, 45), end: h(12) }] }),
    ).toEqual({ ok: false, reason: "overlaps-other-range" });
  });

  it("rejects a range that swallows another range", () => {
    expect(
      check({ start: h(9), end: h(12) }, { otherRanges: [{ start: h(10), end: h(11) }] }),
    ).toEqual({ ok: false, reason: "overlaps-other-range" });
  });

  it("reports the first broken rule: length, grid, Task, Workday, overlap", () => {
    expect(check({ start: h(20), end: h(20, 5) })).toEqual({ ok: false, reason: "too-short" });
    expect(check({ start: h(20, 5), end: h(21) })).toEqual({ ok: false, reason: "off-grid" });
    expect(check({ start: h(14), end: h(15) })).toEqual({ ok: false, reason: "outside-task" });
  });

  it("has a French message for every reason", () => {
    for (const message of Object.values(TIME_RANGE_VIOLATION_MESSAGES)) {
      expect(message).toMatch(/plage horaire/);
    }
  });
});

describe("assignableWindows", () => {
  it("clips the Workday to the Task and removes the other ranges", () => {
    expect(
      assignableWindows({
        task: { start: h(9), end: h(13) },
        workWindows: [{ start: h(8), end: h(18) }],
        otherRanges: [{ start: h(10), end: h(11) }],
      }),
    ).toEqual([
      { start: h(9), end: h(10) },
      { start: h(11), end: h(13) },
    ]);
  });

  it("follows the lunch gap", () => {
    expect(
      assignableWindows({
        task: { start: h(9), end: h(15) },
        workWindows: [
          { start: h(8), end: h(12) },
          { start: h(13), end: h(17) },
        ],
        otherRanges: [],
      }),
    ).toEqual([
      { start: h(9), end: h(12) },
      { start: h(13), end: h(15) },
    ]);
  });

  it("keeps the Task's own off-grid edges, since a range may start or end there", () => {
    expect(
      assignableWindows({
        task: { start: h(9, 10), end: h(10, 50) },
        workWindows: [{ start: h(8), end: h(18) }],
        otherRanges: [],
      }),
    ).toEqual([{ start: h(9, 10), end: h(10, 50) }]);
  });

  it("still pulls onto the grid an edge that comes from a Workday or another range", () => {
    expect(
      assignableWindows({
        task: { start: h(9), end: h(12) },
        workWindows: [{ start: h(9, 7), end: h(18) }],
        otherRanges: [{ start: h(11, 2), end: h(12) }],
      }),
    ).toEqual([{ start: h(9, 15), end: h(11) }]);
  });

  it("offers the leftover between an off-grid Task start and another range", () => {
    const context = {
      task: { start: h(10, 1), end: h(12) },
      workWindows: [{ start: h(8), end: h(18) }],
      otherRanges: [{ start: h(10, 15), end: h(12) }],
    };
    expect(assignableWindows(context)).toEqual([{ start: h(10, 1), end: h(10, 15) }]);
    expect(firstFreeWindow(context)).toEqual({ start: h(10, 1), end: h(10, 15) });
  });

  it("offers the leftover between another range and an off-grid Task end", () => {
    expect(
      assignableWindows({
        task: { start: h(10), end: h(12, 7) },
        workWindows: [{ start: h(8), end: h(18) }],
        otherRanges: [{ start: h(10), end: h(12) }],
      }),
    ).toEqual([{ start: h(12), end: h(12, 7) }]);
  });

  it("does not offer a short window that does not touch the Task's edge", () => {
    expect(
      assignableWindows({
        task: { start: h(10, 1), end: h(12) },
        workWindows: [{ start: h(8), end: h(18) }],
        otherRanges: [
          { start: h(10, 1), end: h(10, 30) },
          { start: h(10, 40), end: h(12) },
        ],
      }),
    ).toEqual([]);
  });

  it("drops windows shorter than the minimum range", () => {
    expect(
      assignableWindows({
        task: { start: h(9), end: h(12) },
        workWindows: [
          { start: h(8), end: h(9, 10) },
          { start: h(11, 55), end: h(18) },
        ],
        otherRanges: [],
      }),
    ).toEqual([]);
  });

  it("only returns windows the validator accepts", () => {
    const context = {
      task: { start: h(8, 10), end: h(17, 50) },
      workWindows: [
        { start: h(7), end: h(12, 20) },
        { start: h(12, 20), end: h(16, 5) },
      ],
      otherRanges: [
        { start: h(9), end: h(10, 30) },
        { start: h(14, 15), end: h(15) },
      ],
    };
    const windows = assignableWindows(context);
    expect(windows.length).toBeGreaterThan(0);
    for (const window of windows) {
      expect(validateTimeRange(window, context)).toEqual({ ok: true });
    }
  });
});

describe("firstFreeWindow", () => {
  it("returns the whole Task when the Employee is free for all of it", () => {
    expect(
      firstFreeWindow({
        task: { start: h(9), end: h(12) },
        workWindows: [{ start: h(8), end: h(18) }],
        otherRanges: [],
      }),
    ).toEqual({ start: h(9), end: h(12) });
  });

  it("returns the earliest free window when the start is taken", () => {
    expect(
      firstFreeWindow({
        task: { start: h(9), end: h(13) },
        workWindows: [{ start: h(8), end: h(18) }],
        otherRanges: [{ start: h(9), end: h(10, 30) }],
      }),
    ).toEqual({ start: h(10, 30), end: h(13) });
  });

  it("skips Workday hours that start after the Task starts", () => {
    expect(
      firstFreeWindow({
        task: { start: h(8), end: h(12) },
        workWindows: [{ start: h(10), end: h(18) }],
        otherRanges: [],
      }),
    ).toEqual({ start: h(10), end: h(12) });
  });

  it("returns null when nothing is free", () => {
    expect(
      firstFreeWindow({
        task: { start: h(9), end: h(11) },
        workWindows: [{ start: h(8), end: h(18) }],
        otherRanges: [{ start: h(8), end: h(12) }],
      }),
    ).toBeNull();
    expect(
      firstFreeWindow({
        task: { start: h(9), end: h(11) },
        workWindows: [],
        otherRanges: [],
      }),
    ).toBeNull();
  });
});
