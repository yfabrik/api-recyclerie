import z from "zod";

import { idSchema, phoneSchema } from "../primitives/zod.js";

export const ecoOrganismDataSchema = z.object({
  name: z.string().trim().nonempty("Le nom est requis"),
  description: z.string().nullish().prefault(null),
  contact_email: z.email().nullish().prefault(null),
  contact_phone: phoneSchema().nullish().prefault(null),
  address: z.string().nullish().prefault(null),
  website: z.url().nullish().prefault(null),
  is_active: z.boolean().optional().default(true),
  inCategories: z.array(idSchema()).optional().default([]),
  sellCategories: z.array(idSchema()).optional().default([]),
});

const ALLOWED_INCLUDES = ["waste", "incategories", "sellcategories"] as const;

export const ecoOrganismFilterSchema = z.object({
  active: z.coerce.boolean().optional(),
  include: z
    .string()
    .toLowerCase()
    .optional()
    .transform((val) => (val ? val.split(",") : []))
    .pipe(z.array(z.enum(ALLOWED_INCLUDES))),
});

export const ecoOrganismQuartersFilterSchema = z.object({
  point: idSchema().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type EcoOrganismQuartersFilter = z.infer<typeof ecoOrganismQuartersFilterSchema>;
export type EcoOrganismQuartersFilterInput = z.input<typeof ecoOrganismQuartersFilterSchema>;

export type EcoOrganismData = z.infer<typeof ecoOrganismDataSchema>;
export type EcoOrganismFilter = z.infer<typeof ecoOrganismFilterSchema>;
export type EcoOrganismDataInput = z.input<typeof ecoOrganismDataSchema>;
export type EcoOrganismFilterInput = z.input<typeof ecoOrganismFilterSchema>;