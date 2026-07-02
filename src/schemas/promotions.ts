import z from "zod";

import { idSchema } from "../primitives/zod.js";

export const promotionDataSchema = z.object({
  startDate: z.coerce.date().transform((v) => v.toDateString()),
  endDate: z.coerce
    .date()
    .transform((v) => v.toDateString())
    .nullable(),
  isActive: z.coerce.boolean().default(true),
  promotionValue: z.coerce
    .number("promotion requise")
    .min(0, "promo min 0")
    .max(100, "promo max 100"),
  category_id: idSchema("categorie requise"),
  stores: z.array(idSchema()).nullish(),
});

export type PromotionData = z.infer<typeof promotionDataSchema>;
