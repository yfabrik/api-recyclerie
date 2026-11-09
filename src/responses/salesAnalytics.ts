import type { IsoDate } from "../primitives/zod.js";
import type { ApiDataResponse } from "../types/response.js";
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
