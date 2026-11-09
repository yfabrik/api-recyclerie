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
