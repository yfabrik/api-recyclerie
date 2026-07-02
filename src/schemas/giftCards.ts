import z from "zod";

import { GIFT_CARD_STATUSES } from "../enums/index.js";
import { enumSchema, idSchema } from "../primitives/zod.js";

export const giftCardIssueSchema = z.object({
  code: z.string().trim().min(1, "code requis"),
  initial_value: z.coerce.number("valeur initiale requise").min(0),
  expires_at: z.coerce.date().nullish(),
  issued_transaction_id: idSchema().nullish(),
  issued_refund_transaction_id: idSchema().nullish(),
  note: z.string().trim().nullish(),
  recipient_name: z.string().trim().nullish(),
  recipient_email: z.email().nullish(),
  metadata: z.record(z.string(), z.any()).nullish(),
});

export const giftCardMovementSchema = z.object({
  sales_transaction_id: idSchema("transaction requise"),
  amount: z.coerce.number("montant requis").positive(),
  metadata: z.record(z.string(), z.any()).nullish(),
});

export const giftCardListFilterSchema = z.object({
  status: enumSchema(GIFT_CARD_STATUSES).optional(),
  code: z.string().trim().optional(),
});

export const giftCardCodeParamSchema = z.string().trim().min(1);

export type GiftCardIssueBody = z.infer<typeof giftCardIssueSchema>;
export type GiftCardMovementBody = z.infer<typeof giftCardMovementSchema>;
