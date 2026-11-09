import type { IsoDate } from "../primitives/zod.js";
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
