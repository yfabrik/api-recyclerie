import * as z from "zod";

import { idSchema } from "../primitives/zod.js";

const ALLOWED_INCLUDES = ["category", "parent", "promo"] as const;

export const categoryDataSchema = z.object({
  name: z.string("Le nom est requis").trim().min(1, "Le nom est requis"),
  description: z.string().nullish().prefault(null),
  icon: z.string().nullish().prefault(null),
  parent_id: idSchema().nullish().prefault(null),
  defaultWeight: z.number().nonnegative().prefault(0),
  defaultPrice: z.number().nonnegative().prefault(0),
  priceBasedOnWeight: z.boolean().prefault(false),
  bundleQuantity: z.coerce
    .number()
    .int()
    .nonnegative()
    .nullish()
    .prefault(null),
  bundlePrice: z.coerce.number().nonnegative().nullish().prefault(null),
});

export const categoryListFilterSchema = z.object({
  include: z
    .string()
    .toLowerCase()
    .optional()
    .transform((val) => (val ? val.split(",") : []))
    .pipe(z.array(z.enum(ALLOWED_INCLUDES))),
  only_category: z.coerce.boolean().optional().default(false),
  only_sub: z.coerce.boolean().optional().default(false),
  out: z.coerce.boolean().optional(),
  in: z.coerce.boolean().optional(),
  sell: z.coerce.boolean().optional(),
  store_id: idSchema().optional(),
});

export const categoryPatchSchema = z.object({
  in: z.boolean().optional(),
  out: z.boolean().optional(),
  sell: z.boolean().optional(),
});

export type CategoryData = z.infer<typeof categoryDataSchema>;
export type CategoryListFilter = z.infer<typeof categoryListFilterSchema>;
export type CategoryPatch = z.infer<typeof categoryPatchSchema>;

export type CategoryDataInput = z.input<typeof categoryDataSchema>;
export type CategoryPatchInput = z.input<typeof categoryPatchSchema>;