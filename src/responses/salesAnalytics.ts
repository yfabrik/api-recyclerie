import type { IsoDate } from "../primitives/zod.js";
import type { ApiDataResponse } from "../types/response.js";
import type { WholeTransactionDiscountKey } from "../domain/notableDiscounts.js";
import type { CategoryBaseDto } from "./categories.js";
import type { RecycleryBaseDto } from "./recycleries.js";

/** Inclusive range of Paris calendar dates. */
export interface SalesAnalyticsDateRangeDto {
  date_from: IsoDate;
  date_to: IsoDate;
}

export interface SalesAnalyticsRangesDto {
  current: SalesAnalyticsDateRangeDto;
  /** Computed by the server from `compare` and `period`; null when `compare=none`. */
  comparison: SalesAnalyticsDateRangeDto | null;
}

/** Shape of every analytics route: the same figures for the current and the comparison range. */
export interface SalesAnalyticsDto<T> {
  ranges: SalesAnalyticsRangesDto;
  current: T;
  comparison: T | null;
}

export type SalesAnalyticsResponse<T> = ApiDataResponse<SalesAnalyticsDto<T>>;

/** `GET /sales-transactions/analytics/kpis`. Amounts in euros, rounded to the cent. */
export interface SalesKpisDto {
  /** Gross revenue − refunded. */
  net_revenue: number;
  /** Sum of Sales. */
  gross_revenue: number;
  /** Sum of Refunds, positive. */
  refunded_amount: number;
  refund_count: number;
  sales_count: number;
  /** Gross revenue / sales count. */
  average_basket: number;
  /** Quantity on Sale lines − quantity on Refund lines. */
  items_sold: number;
  /** Paris calendar days with at least one Sale. */
  opening_days: number;
  /** Net revenue / opening days. */
  revenue_per_opening_day: number;
}

export type SalesAnalyticsKpisResponse = SalesAnalyticsResponse<SalesKpisDto>;

/** A top-level category's share of the discounts given on Sales. */
export interface SalesDiscountCategoryDto {
  /** Top-level category; null for "Sans catégorie". */
  category_id: CategoryBaseDto["id"] | null;
  name: string;
  /** `category_promotion_discount + whole_transaction_discount`. */
  discount: number;
  category_promotion_discount: number;
  /** The category's lines' share of their Sales' whole-transaction discounts, pro rata to line value. */
  whole_transaction_discount: number;
}

/** Figures of the Sales that got one whole-transaction discount (or a group of them). */
export interface WholeTransactionDiscountFiguresDto {
  sales_count: number;
  /** Sum of `total_amount_before_promotion − total_amount`. */
  discount_amount: number;
  /** Mean `total_amount_before_promotion`: after Category promotions, before this discount. */
  average_basket_before: number;
  /** Mean `total_amount`: what the customer paid. */
  average_basket_after: number;
}

export interface WholeTransactionDiscountStoreDto
  extends WholeTransactionDiscountFiguresDto {
  store_id: RecycleryBaseDto["id"];
  store_name: string;
}

/** A notable discount (`NOTABLE_DISCOUNTS`), or "Autres" for every other whole-transaction discount. */
export interface WholeTransactionDiscountDto extends WholeTransactionDiscountFiguresDto {
  key: WholeTransactionDiscountKey;
  /** "40 %", "5 €", "Autres". */
  label: string;
  /** `sales_count` / all Sales in scope (0 to 1). */
  share_of_sales: number;
  /** Split by Store, most discounted first; null when a Store is selected. */
  by_store: WholeTransactionDiscountStoreDto[] | null;
}

/**
 * `GET /sales-transactions/analytics/discounts`. Discounts count on Sales
 * only: Refunds never reduce them. Amounts in euros, rounded to the cent;
 * shares are ratios (0 to 1).
 */
export interface SalesDiscountsDto {
  /** `category_promotion_discount + whole_transaction_discount`. */
  total_discount: number;
  /**
   * Sum over Sale lines of the line value before promotion minus after. The
   * percent is a Category promotion or a % typed at the till: the two can't
   * be told apart.
   */
  category_promotion_discount: number;
  /** Sum over Sales of `total_amount_before_promotion − total_amount`. */
  whole_transaction_discount: number;
  /** Sum of Sales (`total_amount`). */
  gross_revenue: number;
  /** `total_discount / gross_revenue`; 0 without Sales. */
  share_of_gross_revenue: number;
  sales_count: number;
  /** The 5 top-level categories that got the most discount, most first. */
  top_categories: SalesDiscountCategoryDto[];
  /** One per `WHOLE_TRANSACTION_DISCOUNT_GROUPS` entry, in its order: the notable discounts, then "Autres". */
  whole_transaction_discounts: WholeTransactionDiscountDto[];
}

export type SalesAnalyticsDiscountsResponse = SalesAnalyticsResponse<SalesDiscountsDto>;
