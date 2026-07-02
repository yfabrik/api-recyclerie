import * as z from "zod";

import { RECURRENCE_PATTERNS, TASK_CATEGORIES } from "../enums/index.js";
import { enumSchema, idSchema } from "../primitives/zod.js";

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
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
  employee_id: idSchema().optional(),
  status: z.string().optional(),
  store_id: idSchema().optional(),
  category: z.string().optional(),
});

export const taskScheduleDateFilterSchema = z.object({
  start_date: z.coerce.date().optional(),
  end_date: z.coerce.date().optional(),
});

export const assignEmployeeToScheduleBodySchema = z.object({
  employee_id: idSchema("ID employé requis"),
});

export type TaskScheduleData = z.infer<typeof taskScheduleDataSchema>;
export type TaskScheduleFilter = z.infer<typeof taskScheduleFilterSchema>;
