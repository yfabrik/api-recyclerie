import z from "zod";

import { CONDITION_STATES } from "../enums/index.js";
import { enumSchema, idSchema, isoDateSchema } from "../primitives/zod.js";

const LABELED_ITEM_INCLUDES = ["category.subcategories"] as const;

export const labeledItemIncludeSchema = z
  .string()
  .optional()
  .transform((val) => (val ? val.split(",") : []))
  .pipe(z.array(z.enum(LABELED_ITEM_INCLUDES)));

export type LabeledItemInclude = (typeof LABELED_ITEM_INCLUDES)[number];

export const labeledItemDataSchema = z.object({
  name: z.string().nullish(),
  description: z.string().nullish().prefault(null),
  category_id: idSchema("categorie requis"),
  subcategory_id: idSchema().nullish().prefault(null),
  weight: z.coerce.number().nonnegative("poid requis").default(0),
  price: z.coerce.number().nonnegative("prix requis"),
  cost: z.coerce.number().nonnegative().nullish().prefault(null),//TODO alors il exist sur le models mais jamais use
  condition_state: enumSchema(CONDITION_STATES).optional(),
  location: z.string().nullish(),//TODO exist meme pas sur le model
  arrival_id: idSchema().nullish(),//TODO lien exist pas
  purchase_price: z.coerce.number().nonnegative().nullish(),//TODO exist pas et ça fais doublon avec cost, peut etre que c'est a cause de donation, mais c'est pas sur item en tout cas
  selling_price: z.coerce.number().nonnegative().nullish(),//TODO exist pas et ça fais doublon avec cost, peut etre que c'est a cause de donation, mais c'est pas sur item en tout cas
  recyclery_id: idSchema().nullish().prefault(null),
  quantity: z.coerce.number().int().positive().max(100).default(1),
});

export const labeledItemFilterSchema = z.object({
  status: z.string().optional(),
  category_id: idSchema().optional(),
  search: z.string().optional(),
  recyclery_id: idSchema().optional(),
  barcode: idSchema().optional(),
  date_from: isoDateSchema().optional(),
  date_to: isoDateSchema().optional(),
  include: labeledItemIncludeSchema.optional().default([]),
});

export const labeledItemStatsFilterSchema = labeledItemFilterSchema.extend({
  page: z.coerce.number().positive().optional(),
});

export type LabeledItemData = z.infer<typeof labeledItemDataSchema>;
export type LabeledItemFilter = z.infer<typeof labeledItemFilterSchema>;
export type LabeledItemIncludeList = z.infer<typeof labeledItemIncludeSchema>;
export type LabeledItemDataInput = z.input<typeof labeledItemDataSchema>;
export type LabeledItemFilterInput = z.input<typeof labeledItemFilterSchema>;
export type LabeledItemStatsFilterInput = z.input<typeof labeledItemStatsFilterSchema>;