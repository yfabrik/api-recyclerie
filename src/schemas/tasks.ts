import * as z from "zod";

import { RECURRENCE_PATTERNS, TASK_CATEGORIES } from "../enums/index.js";
import { enumSchema, idSchema, isoDateSchema } from "../primitives/zod.js";
import { timeRangeBodySchema } from "./timeRanges.js";

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
  date_from: isoDateSchema().optional(),
  date_to: isoDateSchema().optional(),
  store_id: idSchema().nullish(),
});

/** Optional range: give both `start_time` and `end_time`, or neither (the server picks the first free window). */
export const assignEmployeeToTaskBodySchema = timeRangeBodySchema
  .partial()
  .extend({ employee_id: idSchema("ID employé requis") })
  .refine((body) => (body.start_time === undefined) === (body.end_time === undefined), {
    message: "start_time et end_time vont ensemble",
    path: ["end_time"],
  });

export type TaskData = z.infer<typeof taskDataSchema>;
export type TaskListFilter = z.infer<typeof taskListFilterSchema>;
export type AssignEmployeeToTaskBody = z.infer<typeof assignEmployeeToTaskBodySchema>;

export type TaskDataInput = z.input<typeof taskDataSchema>;
export type TaskListFilterInput = z.input<typeof taskListFilterSchema>;
export type AssignEmployeeToTaskBodyInput = z.input<typeof assignEmployeeToTaskBodySchema>;