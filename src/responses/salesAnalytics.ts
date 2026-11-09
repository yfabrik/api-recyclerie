import type { IsoDate } from "../primitives/zod.js";
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
