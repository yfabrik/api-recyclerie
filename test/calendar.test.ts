import { describe, expect, it } from "vitest";

import {
  addDays,
  addMonths,
  addYears,
  daysBetween,
  endOfMonth,
  isLastDayOfMonth,
  startOfIsoWeek,
  startOfMonth,
  startOfQuarter,
  startOfYear,
} from "../src/domain/calendar.js";

describe("calendar arithmetic on YYYY-MM-DD dates", () => {
  it("adds days across months, years and DST changes", () => {
    expect(addDays("2026-10-25", 1)).toBe("2026-10-26");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2024-12-31", 1)).toBe("2025-01-01");
  });

  it("adds months, clamping to the end of a shorter month", () => {
    expect(addMonths("2026-03-31", -1)).toBe("2026-02-28");
    expect(addMonths("2024-03-31", -1)).toBe("2024-02-29");
    expect(addMonths("2026-11-09", -1)).toBe("2026-10-09");
    expect(addMonths("2026-01-15", -3)).toBe("2025-10-15");
    expect(addMonths("2026-11-30", 3)).toBe("2027-02-28");
  });

  it("adds years, mapping 29 Feb to 28 Feb", () => {
    expect(addYears("2024-02-29", -1)).toBe("2023-02-28");
    expect(addYears("2026-11-09", -1)).toBe("2025-11-09");
  });

  it("counts the days between two dates", () => {
    expect(daysBetween("2026-11-01", "2026-11-09")).toBe(8);
    expect(daysBetween("2026-03-01", "2026-03-31")).toBe(30);
    expect(daysBetween("2026-11-09", "2026-11-01")).toBe(-8);
  });

  it("finds the start and end of a month", () => {
    expect(startOfMonth("2026-11-09")).toBe("2026-11-01");
    expect(endOfMonth("2024-02-10")).toBe("2024-02-29");
    expect(isLastDayOfMonth("2026-04-30")).toBe(true);
    expect(isLastDayOfMonth("2026-03-30")).toBe(false);
  });

  it("starts weeks on Monday", () => {
    expect(startOfIsoWeek("2026-11-09")).toBe("2026-11-09"); // Monday
    expect(startOfIsoWeek("2026-11-08")).toBe("2026-11-02"); // Sunday
    expect(startOfIsoWeek("2026-11-11")).toBe("2026-11-09"); // Wednesday
  });

  it("starts quarters in January, April, July and October", () => {
    expect(startOfQuarter("2026-11-09")).toBe("2026-10-01");
    expect(startOfQuarter("2026-03-31")).toBe("2026-01-01");
    expect(startOfQuarter("2026-04-01")).toBe("2026-04-01");
    expect(startOfYear("2026-11-09")).toBe("2026-01-01");
  });
});
