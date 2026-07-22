import z from "zod";

import { idSchema, isoDateSchema } from "../primitives/zod.js";

export const promotionDataSchema = z.object({
  startDate: isoDateSchema("date de début requise"),
  endDate: isoDateSchema().nullable(),
  isActive: z.coerce.boolean().default(true),
  promotionValue: z.coerce
    .number("promotion requise")
    .min(0, "promo min 0")
    .max(100, "promo max 100"),
  category_id: idSchema("categorie requise"),
  stores: z.array(idSchema()).nullish(),
});

export type PromotionData = z.infer<typeof promotionDataSchema>;
export type PromotionDataInput = z.input<typeof promotionDataSchema>;
