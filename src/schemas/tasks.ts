import * as z from "zod";

import { RECURRENCE_PATTERNS, TASK_CATEGORIES } from "../enums/index.js";
import { enumSchema, idSchema } from "../primitives/zod.js";

export const taskDataSchema = z.object({
  name: z.string("Nom requis"),
  description: z.string().nullish().prefault(null),
  category: enumSchema(TASK_CATEGORIES, "categorie requise"),
  priority: z.string("priorité requis"),
  required_skills: z
    .array(z.string())
    .nullish()
    .default([])
    .transform((val) => JSON.stringify(val)),
  location: z.string().nullish().prefault(null),
  equipment_needed: z
    .array(z.string())
    .nullish()
    .default([])
    .transform((val) => JSON.stringify(val)),
  is_recurring: z.coerce.boolean().optional(),
  recurrence_pattern: enumSchema(RECURRENCE_PATTERNS, "récurrence invalide")
    .nullish()
    .prefault(null),
  assigned_to: idSchema().nullish(),
  notes: z.string().nullish().prefault(null),
  start_time: z.coerce.date().optional().default(new Date()),
  end_time: z.coerce.date().optional().default(new Date()),
  scheduled_date: z.coerce.date().optional().default(new Date()),
  store_id: idSchema().nullish().prefault(null),
});

const ALLOWED_INCLUDES = ["user", "store"] as const;

export const taskListFilterSchema = z.object({
  include: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : []))
    .pipe(z.array(z.enum(ALLOWED_INCLUDES))),
  category: enumSchema(TASK_CATEGORIES).nullable().optional(),
  priority: z.string().optional(),
  search: z.string().optional(),
  date_from: z.coerce.date().optional(),
  date_to: z.coerce.date().optional(),
  store_id: idSchema().nullish(),
});

export const assignEmployeeToTaskBodySchema = z.object({
  employee_id: idSchema("ID employé requis"),
});

export type TaskData = z.infer<typeof taskDataSchema>;
export type TaskListFilter = z.infer<typeof taskListFilterSchema>;
