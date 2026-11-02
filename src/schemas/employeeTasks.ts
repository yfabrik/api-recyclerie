import * as z from "zod";

import { isoDateSchema } from "../primitives/zod.js";

/** Longest range, in days and both ends included, `GET /api/employees/:id/tasks` accepts. */
export const EMPLOYEE_TASKS_MAX_DAYS = 31;

const DAY_MS = 24 * 60 * 60 * 1000;

/** Query of `GET /api/employees/:id/tasks`. Both dates are inclusive; one day is `date_from == date_to`. */
export const employeeTasksQuerySchema = z
  .object({
    date_from: isoDateSchema("date de début requise"),
    date_to: isoDateSchema("date de fin requise"),
  })
  .superRefine((query, ctx) => {
    // `YYYY-MM-DD` parses as UTC midnight, so the difference is a whole number of days.
    const days = (Date.parse(query.date_to) - Date.parse(query.date_from)) / DAY_MS + 1;
    if (days < 1) {
      ctx.addIssue({
        code: "custom",
        path: ["date_to"],
        message: "la date de fin doit être postérieure ou égale à la date de début",
        input: query,
      });
    } else if (days > EMPLOYEE_TASKS_MAX_DAYS) {
      ctx.addIssue({
        code: "custom",
        path: ["date_to"],
        message: `la période ne peut pas dépasser ${EMPLOYEE_TASKS_MAX_DAYS} jours`,
        input: query,
      });
    }
  });

export type EmployeeTasksQuery = z.infer<typeof employeeTasksQuerySchema>;
export type EmployeeTasksQueryInput = z.input<typeof employeeTasksQuerySchema>;
