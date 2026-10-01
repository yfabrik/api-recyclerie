import { describe, expect, it } from "vitest";

import { getWeekNumber } from "../src/domain/date.js";

describe("getWeekNumber — week-start-on-Sunday exploration", () => {
  it("bumps the week number on Sunday, not Monday", () => {
    // Sat 2030-06-01, Sun 2030-06-02, Mon 2030-06-03: consecutive days straddling
    // a Sunday. If weeks started on Monday, the Sunday would share its week
    // number with the Saturday before it. dayjs's default locale starts weeks
    // on Sunday, so the Sunday instead shares its number with the Monday after.
    const saturday = getWeekNumber(new Date("2030-06-01"));
    const sunday = getWeekNumber(new Date("2030-06-02"));
    const monday = getWeekNumber(new Date("2030-06-03"));

    expect(sunday).toBe(saturday + 1);
    expect(sunday).toBe(monday);
  });

  it("documents the parity flip this causes week over week", () => {
    // Every Sunday is the first day of a new dayjs week, so each Sunday→Saturday
    // span has a single, stable week number/parity — but that span runs
    // Sun..Sat, not the Mon..Sun span a calendar-literate human expects.
    const sundayParity = getWeekNumber(new Date("2030-06-02")) % 2;
    const followingSaturdayParity = getWeekNumber(new Date("2030-06-08")) % 2;
    expect(sundayParity).toBe(followingSaturdayParity);

    const precedingSaturdayParity = getWeekNumber(new Date("2030-06-01")) % 2;
    expect(sundayParity).not.toBe(precedingSaturdayParity);
  });
});
