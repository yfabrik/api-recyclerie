import z from "zod";

import { TIME_SLOTS } from "../enums/index.js";
import {
  enumSchema,
  isoTimeSchema,
  weekdaySchema,
} from "../primitives/zod.js";

export const employeeWorkdayItemSchema = z.object({
  day_of_week: weekdaySchema("jour requis"),
  time_slot: enumSchema(TIME_SLOTS, "créneau requis"),
  is_working: z.boolean(),
  start_time: isoTimeSchema("heure de début requise"),
  end_time: isoTimeSchema("heure de fin requise"),
  notes: z.string().nullish(),
  week: z.string().regex(/^week[1-9]$/, "week format incorrect"),
});

export const employeeWorkdaysBulkSchema = z.object({
  workdays: z.array(employeeWorkdayItemSchema, "workdays doit être un tableau"),
});

export type EmployeeWorkdayItem = z.infer<typeof employeeWorkdayItemSchema>;
export type EmployeeWorkdaysBulkBody = z.infer<typeof employeeWorkdaysBulkSchema>;
export type EmployeeWorkdayItemInput = z.input<typeof employeeWorkdayItemSchema>;
export type EmployeeWorkdaysBulkInput = z.input<typeof employeeWorkdaysBulkSchema>;
