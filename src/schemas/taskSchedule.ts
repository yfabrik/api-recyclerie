import * as z from "zod";

import { RECURRENCE_PATTERNS, TASK_CATEGORIES } from "../enums/index.js";
import { enumSchema, idSchema, isoDateSchema } from "../primitives/zod.js";

export const taskScheduleDataSchema = z.object({
  scheduled_date: z.coerce.date("date requis"),
  start_time: z.coerce.date("heure de debut requis"),
  end_time: z.coerce.date("heure de fin requis"),
  category: enumSchema(TASK_CATEGORIES, "catégorie requise"),
  notes: z.string().nullish().prefault(null),
  store_id: idSchema().nullish().prefault(null),
  collection_point_id: idSchema().nullish().prefault(null),
  recurrence_pattern: enumSchema(RECURRENCE_PATTERNS, "récurrence invalide")
    .nullish()
    .prefault(null),
  is_recurring: z.coerce.boolean().default(true),
  name: z.string().nullish(),
  location: z.string().nullish().prefault(null),
});

export const taskScheduleFilterSchema = z.object({
  start_date: isoDateSchema().optional(),
  end_date: isoDateSchema().optional(),
  employee_id: idSchema().optional(),
  status: z.string().optional(),
  store_id: idSchema().optional(),
  category: z.string().optional(),
});

export const taskScheduleDateFilterSchema = z.object({
  start_date: isoDateSchema().optional(),
  end_date: isoDateSchema().optional(),
});

export const assignEmployeeToScheduleBodySchema = z.object({
  employee_id: idSchema("ID employé requis"),
});

export type TaskScheduleData = z.infer<typeof taskScheduleDataSchema>;
export type TaskScheduleFilter = z.infer<typeof taskScheduleFilterSchema>;
export type TaskScheduleDateFilter = z.infer<typeof taskScheduleDateFilterSchema>;
export type AssignEmployeeToScheduleBody = z.infer<typeof assignEmployeeToScheduleBodySchema>;
export type TaskScheduleDataInput = z.input<typeof taskScheduleDataSchema>;
export type TaskScheduleFilterInput = z.input<typeof taskScheduleFilterSchema>;
export type TaskScheduleDateFilterInput = z.input<typeof taskScheduleDateFilterSchema>;
export type AssignEmployeeToScheduleBodyInput = z.input<typeof assignEmployeeToScheduleBodySchema>;