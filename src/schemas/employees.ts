import z from "zod";

import { idSchema, phoneSchema } from "../primitives/zod.js";

export const employeeDataSchema = z.object({
  nom: z.string("nom requis").trim().nonempty("nom requis"),
  prenom: z.string("prenom requis").trim().nonempty("prenom requis"),
  isActive: z.coerce.boolean().default(true),
  email: z.email().nullish().prefault(null),
  phone: phoneSchema().nullish().prefault(null),
});

export const employeeSkillsSchema = z.object({
  skills: z.array(idSchema()),
});

export type EmployeeData = z.infer<typeof employeeDataSchema>;
export type EmployeeSkillsBody = z.infer<typeof employeeSkillsSchema>;
