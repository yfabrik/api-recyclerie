import * as z from "zod";

import { idSchema, phoneSchema, postalSchema } from "../primitives/zod.js";

export const recycleryDataSchema = z.object({
  name: z
    .string("Le nom de la recyclerie est requis")
    .trim()
    .nonempty("nom requis"),
  address: z.string().nullish().prefault(null),
  phone: phoneSchema().nullish().prefault(null),
  email: z.email().nullish().prefault(null),
  manager_id: idSchema().nullish().prefault(null),
  city: z.string().nullish().prefault(null),
  postal_code: postalSchema().nullish().prefault(null),
  is_active: z.coerce.boolean().default(true),
});

const ALLOWED_INCLUDES = ["employees", "horaires", "caisses"] as const;

export const recycleryFilterSchema = z.object({
  include: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : []))
    .pipe(z.array(z.enum(ALLOWED_INCLUDES))),
  active: z.coerce.boolean().optional(),
});

export type RecycleryData = z.infer<typeof recycleryDataSchema>;
export type RecycleryFilter = z.infer<typeof recycleryFilterSchema>;
export type RecycleryDataInput = z.input<typeof recycleryDataSchema>;
export type RecycleryFilterInput = z.input<typeof recycleryFilterSchema>;