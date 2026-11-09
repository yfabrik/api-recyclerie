import z from "zod";

import { idSchema, isoDateSchema } from "../primitives/zod.js";

/** How the period was picked on the page. Tells the server how `compare=previous` shifts. */
export const SALES_ANALYTICS_PERIODS = [
  "week",
  "month",
  "quarter",
  "year",
  "custom",
] as const;
export type SalesAnalyticsPeriod = (typeof SALES_ANALYTICS_PERIODS)[number];

export const SALES_ANALYTICS_COMPARE_MODES = [
  "last_year",
  "previous",
  "none",
] as const;
export type SalesAnalyticsCompareMode =
  (typeof SALES_ANALYTICS_COMPARE_MODES)[number];

/**
 * Query shared by every `/sales-transactions/analytics/*` route, without the
 * `date_from <= date_to` check. A route with its own params extends this, then
 * wraps the result with `withDateOrder`.
 */
export const salesAnalyticsQueryBaseSchema = z.object({
  store_id: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    idSchema("magasin invalide").optional(),
  ),
  /** Inclusive, Paris calendar date. */
  date_from: isoDateSchema("date_from requise (AAAA-MM-JJ)"),
  /** Inclusive, Paris calendar date. */
  date_to: isoDateSchema("date_to requise (AAAA-MM-JJ)"),
  period: z
    .enum(SALES_ANALYTICS_PERIODS, "période inconnue")
    .default("custom"),
  compare: z
    .enum(SALES_ANALYTICS_COMPARE_MODES, "comparaison inconnue")
    .default("last_year"),
});

/** Refuses a range whose `date_from` is after its `date_to`. */
export const withDateOrder = <
  T extends z.ZodType<{ date_from: string; date_to: string }>,
>(
  schema: T,
) =>
  schema.refine((query) => query.date_from <= query.date_to, {
    message: "date_from doit être antérieure ou égale à date_to",
    path: ["date_to"],
  });

export const salesAnalyticsQuerySchema = withDateOrder(
  salesAnalyticsQueryBaseSchema,
);

export type SalesAnalyticsQuery = z.infer<typeof salesAnalyticsQuerySchema>;
export type SalesAnalyticsQueryInput = z.input<typeof salesAnalyticsQuerySchema>;

/**
 * `GET /sales-transactions/analytics/categories`. Without `parent_id`: the
 * top-level categories. With it: that category's direct children, plus the
 * items attached directly to it.
 */
export const salesCategoriesQuerySchema = withDateOrder(
  salesAnalyticsQueryBaseSchema.extend({
    parent_id: idSchema("catégorie invalide").optional(),
  }),
);

export type SalesCategoriesQuery = z.infer<typeof salesCategoriesQuerySchema>;
export type SalesCategoriesQueryInput = z.input<
  typeof salesCategoriesQuerySchema
>;
