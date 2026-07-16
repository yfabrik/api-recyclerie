import z from "zod";

import { idSchema, phoneSchema } from "../primitives/zod.js";

export const employeeDataSchema = z.object({
  nom: z.string("nom requis").trim().nonempty("nom requis"),
  prenom: z.string("prenom requis").trim().nonempty("prenom requis"),
  isActive: z.coerce.boolean().default(true),
  email: z.email().nullish().prefault(null),
  phone: phoneSchema().nullish().prefault(null),
});

export const employeeFilterSchema = z.object({
  store_id: idSchema().optional(),
  active: z.coerce.boolean().optional(),
  include:z.string().optional()
});

export const employeeSkillsSchema = z.object({
  skills: z.array(idSchema()),
});

export type EmployeeData = z.infer<typeof employeeDataSchema>;
export type EmployeeSkillsBody = z.infer<typeof employeeSkillsSchema>;
export type EmployeeFilterInput = z.input<typeof employeeFilterSchema>;
export type EmployeeDataInput = z.input<typeof employeeDataSchema>;
export type EmployeeSkillsInput = z.input<typeof employeeSkillsSchema>;

export type EmployeeFilters = z.infer<typeof employeeFilterSchema>;