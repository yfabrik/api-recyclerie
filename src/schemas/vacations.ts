import z from "zod";

import { VACATION_REASONS } from "../enums/index.js";
import { enumSchema, idSchema, isoDateSchema } from "../primitives/zod.js";

export const vacationBodySchema = z
  .object({
    start_date: isoDateSchema("date de début requise"),
    end_date: isoDateSchema("date de fin requise"),
    reason: enumSchema(VACATION_REASONS, "motif requis").default("other"),
    notes: z.string().nullish().prefault(null),
  })
  .superRefine((obj, ctx) => {
    if (obj.end_date < obj.start_date) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "la date de fin doit être postérieure ou égale à la date de début",
        input: obj,
      });
    }
  });

export const vacationUpdateSchema = z
  .object({
    start_date: isoDateSchema("date de début requise").optional(),
    end_date: isoDateSchema("date de fin requise").optional(),
    reason: enumSchema(VACATION_REASONS, "motif requis").optional(),
    notes: z.string().nullish(),
  })
  .superRefine((obj, ctx) => {
    if (
      obj.start_date != null &&
      obj.end_date != null &&
      obj.end_date < obj.start_date
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["end_date"],
        message: "la date de fin doit être postérieure ou égale à la date de début",
        input: obj,
      });
    }
  });

export const vacationFilterSchema = z.object({
  employee_id: idSchema().optional(),
  reason: enumSchema(VACATION_REASONS).optional(),
  date_from: isoDateSchema().optional(),
  date_to: isoDateSchema().optional(),
});

export const vacationIdParamsSchema = z.object({
  id: idSchema(),
});

export const vacationEmployeeParamsSchema = z.object({
  employeeId: idSchema("ID employé requis"),
});

export type VacationBody = z.infer<typeof vacationBodySchema>;
export type VacationUpdateBody = z.infer<typeof vacationUpdateSchema>;
export type VacationFilter = z.infer<typeof vacationFilterSchema>;
export type VacationIdParams = z.infer<typeof vacationIdParamsSchema>;
export type VacationEmployeeParams = z.infer<typeof vacationEmployeeParamsSchema>;
export type VacationBodyInput = z.input<typeof vacationBodySchema>;
export type VacationUpdateInput = z.input<typeof vacationUpdateSchema>;
export type VacationFilterInput = z.input<typeof vacationFilterSchema>;
export type VacationIdParamsInput = z.input<typeof vacationIdParamsSchema>;
export type VacationEmployeeParamsInput = z.input<
  typeof vacationEmployeeParamsSchema
>;
