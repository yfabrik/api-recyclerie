import * as z from "zod";

import { CASH_SESSION_STATUSES } from "../enums/index.js";
import { enumSchema, idSchema } from "../primitives/zod.js";

export const cashSessionFilterSchema = z.object({
  store_id: z.coerce.number().positive().optional(),
  user_id: z.coerce.number().positive().optional(),
  status: enumSchema(CASH_SESSION_STATUSES).optional(),
});

export const openCashSessionSchema = z.object({
  cash_register_id: idSchema("caisse requise"),
  store_id: idSchema("magasin requis"),
  opening_amount: z.coerce.number().positive("argent requis"),
  notes: z.string().nullish().prefault(null),
});

export const closeCashSessionSchema = z.object({
  closing_amount: z.coerce.number().positive("argent requis"),
  notes: z.string().nullish().prefault(null),
});

export const cashSessionStatsFilterSchema = z.object({
  date_from: z.coerce.date().nullish(),
  date_to: z.coerce.date().nullish(),
  store_id: idSchema().nullish(),
});

export type OpenCashSessionBody = z.infer<typeof openCashSessionSchema>;
export type CloseCashSessionBody = z.infer<typeof closeCashSessionSchema>;
