import { describe, expect, it } from "vitest";

import { assignEmployeeToTaskBodySchema } from "../src/schemas/tasks.js";
import { timeRangeBodySchema } from "../src/schemas/timeRanges.js";

describe("timeRangeBodySchema", () => {
  it("accepts HH:MM times", () => {
    expect(timeRangeBodySchema.parse({ start_time: "09:00", end_time: "10:15" })).toEqual({
      start_time: "09:00",
      end_time: "10:15",
    });
  });

  it("normalises HH:MM:SS to HH:MM", () => {
    expect(timeRangeBodySchema.parse({ start_time: "09:00:00", end_time: "10:15:00" })).toEqual({
      start_time: "09:00",
      end_time: "10:15",
    });
  });

  it("requires both times", () => {
    expect(timeRangeBodySchema.safeParse({ start_time: "09:00" }).success).toBe(false);
    expect(timeRangeBodySchema.safeParse({ end_time: "10:00" }).success).toBe(false);
  });

  it("rejects malformed times", () => {
    expect(timeRangeBodySchema.safeParse({ start_time: "9h", end_time: "10:00" }).success).toBe(
      false,
    );
  });
});

describe("assignEmployeeToTaskBodySchema", () => {
  it("accepts an employee alone", () => {
    expect(assignEmployeeToTaskBodySchema.parse({ employee_id: "4" })).toEqual({
      employee_id: 4,
    });
  });

  it("accepts an employee with a full range", () => {
    expect(
      assignEmployeeToTaskBodySchema.parse({
        employee_id: 4,
        start_time: "09:00",
        end_time: "10:00",
      }),
    ).toEqual({ employee_id: 4, start_time: "09:00", end_time: "10:00" });
  });

  it("rejects half a range", () => {
    expect(
      assignEmployeeToTaskBodySchema.safeParse({ employee_id: 4, start_time: "09:00" }).success,
    ).toBe(false);
    expect(
      assignEmployeeToTaskBodySchema.safeParse({ employee_id: 4, end_time: "10:00" }).success,
    ).toBe(false);
  });

  it("still requires an employee", () => {
    expect(assignEmployeeToTaskBodySchema.safeParse({}).success).toBe(false);
  });
});
