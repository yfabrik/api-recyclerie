import { describe, expect, it } from "vitest";

import { eachIsoDate } from "../src/domain/date.js";
import { isoDateSchema } from "../src/primitives/zod.js";
import {
  EMPLOYEE_TASKS_MAX_DAYS,
  employeeTasksQuerySchema,
} from "../src/schemas/employeeTasks.js";

describe("employeeTasksQuerySchema", () => {
  it("accepts a single day (date_from == date_to)", () => {
    expect(
      employeeTasksQuerySchema.parse({ date_from: "2030-06-02", date_to: "2030-06-02" }),
    ).toEqual({ date_from: "2030-06-02", date_to: "2030-06-02" });
  });

  it("accepts a multi-day range", () => {
    expect(
      employeeTasksQuerySchema.safeParse({ date_from: "2030-06-02", date_to: "2030-06-08" })
        .success,
    ).toBe(true);
  });

  it("requires both dates", () => {
    expect(employeeTasksQuerySchema.safeParse({ date_from: "2030-06-02" }).success).toBe(false);
    expect(employeeTasksQuerySchema.safeParse({ date_to: "2030-06-02" }).success).toBe(false);
    expect(employeeTasksQuerySchema.safeParse({}).success).toBe(false);
  });

  it("rejects malformed dates", () => {
    expect(
      employeeTasksQuerySchema.safeParse({ date_from: "02/06/2030", date_to: "2030-06-02" })
        .success,
    ).toBe(false);
  });

  it("rejects a range that ends before it starts", () => {
    expect(
      employeeTasksQuerySchema.safeParse({ date_from: "2030-06-03", date_to: "2030-06-02" })
        .success,
    ).toBe(false);
  });

  it("allows exactly 31 days, inclusive", () => {
    expect(EMPLOYEE_TASKS_MAX_DAYS).toBe(31);
    // 2030-06-01 .. 2030-07-01 is 31 days counting both ends
    expect(
      employeeTasksQuerySchema.safeParse({ date_from: "2030-06-01", date_to: "2030-07-01" })
        .success,
    ).toBe(true);
  });

  it("rejects 32 days", () => {
    expect(
      employeeTasksQuerySchema.safeParse({ date_from: "2030-06-01", date_to: "2030-07-02" })
        .success,
    ).toBe(false);
  });
});

describe("eachIsoDate", () => {
  const d = (value: string) => isoDateSchema().parse(value);

  it("returns the single day when from == to", () => {
    expect(eachIsoDate(d("2030-06-02"), d("2030-06-02"))).toEqual(["2030-06-02"]);
  });

  it("lists every day, both ends included, across a month change", () => {
    expect(eachIsoDate(d("2030-06-29"), d("2030-07-02"))).toEqual([
      "2030-06-29",
      "2030-06-30",
      "2030-07-01",
      "2030-07-02",
    ]);
  });

  it("is not thrown off by the spring daylight-saving change", () => {
    expect(eachIsoDate(d("2030-03-30"), d("2030-04-01"))).toEqual([
      "2030-03-30",
      "2030-03-31",
      "2030-04-01",
    ]);
  });
});
