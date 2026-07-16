import z from "zod";

import { COLLECTION_POINT_TYPES } from "../enums/index.js";
import { enumSchema, idSchema, phoneSchema, postalSchema } from "../primitives/zod.js";

const ALLOWED_INCLUDES = ["horaires"] as const;

export const collectionPointDataSchema = z.object({
  name: z.string().trim().nonempty("nom requis"),
  address: z.string().trim().nonempty("addresse requis"),
  city: z.string().trim().nonempty("ville requis"),
  postal_code: postalSchema("code postal requis"),
  contact_person: z.string().nullish().prefault(null),
  contact_phone: phoneSchema().nullish().prefault(null),
  contact_email: z.email().nullish().prefault(null),
  type: enumSchema(COLLECTION_POINT_TYPES).optional().default("standard"),
  notes: z.string().nullish().prefault(null),
  recyclery_id: idSchema().nullish().prefault(null),
  is_active: z.coerce.boolean().optional().default(true),
});

export const collectionPointFilterSchema = z.object({
  active_only: z.coerce.boolean().optional(),
  include: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : []))
    .pipe(z.array(z.enum(ALLOWED_INCLUDES))),
});

export type CollectionPointData = z.infer<typeof collectionPointDataSchema>;
export type CollectionPointFilter = z.infer<typeof collectionPointFilterSchema>;
export type CollectionPointDataInput = z.input<typeof collectionPointDataSchema>;
export type CollectionPointFilterInput = z.input<typeof collectionPointFilterSchema>;