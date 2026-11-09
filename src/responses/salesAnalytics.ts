import type { SalesPaymentMethod, Weekday } from "../enums/index.js";
import type { IsoDate } from "../primitives/zod.js";
import type { RecycleryBaseDto } from "./recycleries.js";
import type { ApiDataResponse } from "../types/response.js";
import type { FrenchPostalCode } from "../primitives/zod.js";

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
