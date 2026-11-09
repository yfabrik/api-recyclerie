import type { IsoDate } from "../primitives/zod.js";
import type { RecycleryBaseDto } from "./recycleries.js";
import type { ApiDataResponse } from "../types/response.js";

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
