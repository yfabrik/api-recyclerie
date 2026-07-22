import z from "zod";

import {
  PAYMENT_METHODS,
  PROMOTION_TYPES,
  SALES_PAYMENT_METHODS,
  TRANSACTION_TYPES,
} from "../enums/index.js";
import { enumSchema, idSchema, isoDateSchema, postalSchema } from "../primitives/zod.js";

const NON_GIFTCARD_PAYMENT_METHODS = PAYMENT_METHODS.filter(
  (method): method is Exclude<(typeof PAYMENT_METHODS)[number], "giftcard"> =>
    method !== "giftcard",
) as [
  Exclude<(typeof PAYMENT_METHODS)[number], "giftcard">,
  ...Exclude<(typeof PAYMENT_METHODS)[number], "giftcard">[],
];

export const transactionItemSchema = z.object({
  name: z.string("nom requis"),
  price: z.coerce.number("prix requis").positive(),
  quantity: z.coerce.number().positive().default(1),
  category_id: idSchema(),
  subcategory_id: idSchema().nullish(),
  weight: z.coerce.number("poid requis").nonnegative(),
  barcode: z.string("code-barres requis"),
  promotion: z.coerce.number().min(0).max(100).nullish(),
  bundlePrice: z.coerce.number().nullish(),
  bundleQuantity: z.coerce.number().nullish(),
});


//TODO j'aime pas mais ça permet de valider que  giftcard a un code
export const paymentLineSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("giftcard"),
    amount: z.coerce.number("montant requis").positive(),
    gift_card_code: z.string("code carte cadeau requis").trim().min(1),
  }),
  z.object({
    method: enumSchema(
      NON_GIFTCARD_PAYMENT_METHODS,
      "mode de paiement requis",
    ),
    amount: z.coerce.number("montant requis").positive(),
    // gift_card_code: z.string().trim().min(1).nullish(),
  }),
]);

export const saleTransactionBaseSchema = z.object({
  cash_session_id: idSchema("sesions requis"),
  total_amount: z.coerce.number("argent requis"),
  total_amount_before_promotion: z.coerce.number("argent requis"),
  payment_amount: z.coerce.number("argent requis"),
  payments: z.array(paymentLineSchema).optional(),//TODO optional really ?
  customer_postal_code: postalSchema().nullish(),
  items: z.array(transactionItemSchema),
  change_amount: z.coerce.number().optional(),
  global_promotion: z.coerce
    .number()
    .min(0, "La promotion globale doit être supérieure à 0")
    .nullish(),
  global_promotion_type: enumSchema(
    PROMOTION_TYPES,
    "Type de promotion globale invalide",
  ).nullish(),
});

const ALLOWED_INCLUDES = ["refund", "items", "payments"] as const;

export const transactionListFilterSchema = z.object({
  store_id: z.preprocess(
    (val) => (val === "" ? undefined : val),
    idSchema().optional().nullable(),
  ),
  period: z.string().optional(),
  type: enumSchema(TRANSACTION_TYPES, "type de transaction inconnu").optional(),
  date_from: isoDateSchema().optional(),
  date_to: isoDateSchema().optional(),
  session: idSchema().optional(),
  payment_method: enumSchema(
    SALES_PAYMENT_METHODS,
    "methode de payment inconnue",
  ).optional(),
  transaction_number: z.string().optional(),
  include: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : []))
    .pipe(z.array(z.enum(ALLOWED_INCLUDES))),
});

export const refundItemSchema = transactionItemSchema;

export const refundDataSchema = z.object({
  cash_session_id: idSchema(),
  total_amount: z.coerce.number("argent requis"),
  payment_method: enumSchema(PAYMENT_METHODS).default("cash"),//TODO firce front to yse refund method ?
  refund_method: enumSchema(PAYMENT_METHODS).default("cash"),
  gift_card_code: z.string().trim().min(1).nullish(),
  refund_reason: z.string("refund raison requis"),
  items: z.array(refundItemSchema),
});

export const transactionStatsFilterSchema = z.object({
  store_id: z.union([idSchema(), z.literal("")]).nullish(),
  date_from: isoDateSchema().optional(),
  date_to: isoDateSchema().optional(),
});

export type TransactionItem = z.infer<typeof transactionItemSchema>;
export type SaleTransactionBase = z.infer<typeof saleTransactionBaseSchema>;
export type RefundData = z.infer<typeof refundDataSchema>;
export type TransactionListFilter = z.infer<typeof transactionListFilterSchema>;
export type TransactionStatsFilter = z.infer<typeof transactionStatsFilterSchema>;

export type TransactionItemInput = z.input<typeof transactionItemSchema>;
export type PaymentLineInput = z.input<typeof paymentLineSchema>;
export type SaleTransactionBaseInput = z.input<typeof saleTransactionBaseSchema>;
export type RefundDataInput = z.input<typeof refundDataSchema>;
export type TransactionListFilterInput = z.input<typeof transactionListFilterSchema>;
export type TransactionStatsFilterInput = z.input<typeof transactionStatsFilterSchema>;