import type { SalesPaymentMethod, Weekday } from "../enums/index.js";
import type { IsoDate } from "../primitives/zod.js";
import type { RecycleryBaseDto } from "./recycleries.js";
import type { ApiDataResponse } from "../types/response.js";
import type { FrenchPostalCode } from "../primitives/zod.js";
import type { WholeTransactionDiscountKey } from "../domain/notableDiscounts.js";
import type { CategoryBaseDto } from "./categories.js";

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

/** A postal code's Sales in the range. Amounts in euros, rounded to the cent. */
export interface SalesPostalCodeDto {
  postal_code: FrenchPostalCode;
  /**
   * Sales with this postal code − the Refunds of such Sales made in the range
   * (a Refund has no postal code of its own: it takes its Sale's).
   */
  net_revenue: number;
  sales_count: number;
  /** Gross revenue of these Sales / sales count. */
  average_basket: number;
}

/** `GET /sales-transactions/analytics/postal-codes`. The till does not require a postal code. */
export interface SalesPostalCodesDto {
  /** The 10 postal codes with the highest net revenue, highest first. Only codes with a Sale in the range. */
  postal_codes: SalesPostalCodeDto[];
  /** Sales that have a postal code. */
  sales_with_postal_code: number;
  /** All Sales. */
  sales_count: number;
}

export type SalesAnalyticsPostalCodesResponse =
  SalesAnalyticsResponse<SalesPostalCodesDto>;

/** One weekday × hour cell: the Sales and Refunds made in that Paris hour, on that weekday, over the range. */
export interface SalesHeatmapCellDto {
  /** Paris clock hour, 0–23: the cell covers `[hour, hour + 1)`. */
  hour: number;
  /** Sales − Refunds made in that hour, in euros. Negative when Refunds outweigh Sales. */
  net_revenue: number;
  sales_count: number;
}

export interface SalesHeatmapRowDto {
  /** Paris weekday, JS numbering: 0 = Sunday … 6 = Saturday. */
  weekday: Weekday;
  /** One cell per column, in `hours` order. */
  cells: SalesHeatmapCellDto[];
}

/** `GET /sales-transactions/analytics/heatmap`. */
export interface SalesHeatmapDto {
  /** Columns: the Paris hours with at least one Sale in the range, ascending. */
  hours: number[];
  /** Rows, Monday to Sunday. */
  rows: SalesHeatmapRowDto[];
}

export type SalesAnalyticsHeatmapResponse = SalesAnalyticsResponse<SalesHeatmapDto>;

/** One payment method in `GET /sales-transactions/analytics/payment-methods`. Amounts in euros, rounded to the cent. */
export interface SalesPaymentMethodDto {
  /** A payment row's method; `mixed` only for an old Sale with no payment rows, whose split is unknown. */
  method: SalesPaymentMethod;
  /** Collected on Sales through this method. Cash is what the till kept: change excluded. */
  sales_amount: number;
  /** `sales_amount` / the Sales total, from 0 to 1. */
  sales_share: number;
  /** Payments on Sales through this method. */
  payment_count: number;
  /** Paid back on Refunds through this method, positive. */
  refunded_amount: number;
}

/** `GET /sales-transactions/analytics/payment-methods`: Sales split by amount, Refunds apart. */
export interface SalesPaymentMethodsDto {
  /** Collected on Sales, all methods: gross revenue. */
  sales_amount: number;
  /** Paid back on Refunds, all methods, positive. */
  refunded_amount: number;
  /** Every method used by a Sale or a Refund in the range, by `sales_amount` then `refunded_amount`, largest first. */
  methods: SalesPaymentMethodDto[];
}

export type SalesAnalyticsPaymentMethodsResponse =
  SalesAnalyticsResponse<SalesPaymentMethodsDto>;

/** One Store's figures in `GET /sales-transactions/analytics/stores`. Amounts in euros, rounded to the cent. */
export interface SalesStoreDto {
  store_id: RecycleryBaseDto["id"];
  name: RecycleryBaseDto["name"];
  /** An inactive Store is listed only when it has Sales or Refunds in the range. */
  is_active: RecycleryBaseDto["is_active"];
  /** Gross revenue − refunded. */
  net_revenue: number;
  /** Sum of the Store's Sales. */
  gross_revenue: number;
  /** Sum of the Refunds paid out at the Store (its own cash session), positive. */
  refunded_amount: number;
  sales_count: number;
  refund_count: number;
  /** Gross revenue / sales count. */
  average_basket: number;
  /** Store net revenue / net revenue of every listed Store, 0–1 rounded to 4 decimals; 0 when that total is not positive. */
  net_revenue_share: number;
}

/**
 * `GET /sales-transactions/analytics/stores`: every active Store (zero row when
 * it sold nothing), plus any inactive Store with Sales or Refunds in the
 * range, by net revenue then name. Store rows add up to the KPIs.
 */
export interface SalesStoresDto {
  stores: SalesStoreDto[];
}

export type SalesAnalyticsStoresResponse = SalesAnalyticsResponse<SalesStoresDto>;

/** Bucket size of the revenue timeline, picked by the server from the length of the current range. */
export type SalesTimelineStep = "day" | "week" | "month";

/** One bucket of the revenue timeline. Amounts in euros, rounded to the cent. */
export interface SalesTimelineBucketDto {
  /** First Paris calendar day of the bucket: a partial week or month at the edge starts on its real date. */
  date_from: IsoDate;
  /** Last Paris calendar day of the bucket, inclusive. */
  date_to: IsoDate;
  /** Gross revenue − refunded. */
  net_revenue: number;
  /** Sum of Sales. */
  gross_revenue: number;
  /** Sum of Refunds made in the bucket, positive. */
  refunded_amount: number;
  sales_count: number;
}

/** `GET /sales-transactions/analytics/timeline`. */
export interface SalesTimelineDto {
  /** Chosen on the current range: day up to 31 days, Monday week up to 184 days, month beyond. Same in the comparison. */
  step: SalesTimelineStep;
  /**
   * Every bucket of the range, in order, empty ones as 0. Never null in the
   * current series. The comparison has one entry per current bucket, at the
   * same position: that bucket shifted onto the comparison range (by days for
   * day and week steps, by months for the month step) and clipped to it, or
   * null where it falls past the end of a shorter comparison range.
   */
  buckets: (SalesTimelineBucketDto | null)[];
}

export type SalesAnalyticsTimelineResponse = SalesAnalyticsResponse<SalesTimelineDto>;

/** A category on the way from the top level down to the opened one. */
export interface SalesCategoryRefDto {
  id: CategoryBaseDto["id"];
  name: string;
}

/**
 * One category of `GET /sales-transactions/analytics/categories`, with every
 * category under it. Sale lines minus Refund lines; each whole-transaction
 * discount is shared across its transaction's lines pro rata to line value.
 */
export interface SalesCategoryRowDto {
  /**
   * null: items with no category ("Sans catégorie"). The opened category's
   * own id: the items attached directly to it.
   */
  category_id: CategoryBaseDto["id"] | null;
  name: string;
  /** Can be opened with `parent_id`. */
  has_subcategories: boolean;
  net_revenue: number;
  /** Quantity sold − quantity refunded. */
  quantity: number;
  /** Share of the listed categories' net revenue (of net revenue at the top level), 0–1. */
  share: number;
  /** Net revenue / quantity; 0 when the quantity is not positive. */
  average_price: number;
}

/** `GET /sales-transactions/analytics/categories`. Amounts in euros, rounded to the cent. */
export interface SalesCategoriesDto {
  /** From the top-level category down to the opened one (`parent_id`); empty at the top level. */
  path: SalesCategoryRefDto[];
  /** Sum of the rows: net revenue at the top level. Rows are rounded so they add up to it. */
  net_revenue: number;
  /** Sum of the rows: items sold at the top level. */
  quantity: number;
  /** Highest net revenue first. */
  categories: SalesCategoryRowDto[];
}

export type SalesAnalyticsCategoriesResponse =
  SalesAnalyticsResponse<SalesCategoriesDto>;

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
