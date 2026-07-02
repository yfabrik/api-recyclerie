import type {
  ApiDataResponse,
} from "../types/response.js";
import type { RecycleryDto } from "./recycleries.js";

export interface DashboardStatsDto {
  totalItems: number;
  availableItems: number;
  soldThisMonth: number;
  totalRevenue: number;
  pendingDonations: number;
  scheduledCollections: number;
  categoriesCount: number;
  usersCount: number;
  lastMonthRevenue: number;
  lastMonthSales: number;
  thisMonthRevenue: number;
  thisMonthSales: number;
}

export interface DashboardActivityDto {
  id: string;
  type: string;
  description: string;
  amount: string;
  time: string;
  icon: string;
  color: string;
  status: string;
  statusColor: string;
}

export interface DashboardChartsDto {
  sales: number[];
  revenue: number[];
  labels: string[];
}

export interface DashboardStoreMonthStatsDto {
  transactions: number;
  revenue: number;
  averageTransaction: number;
  sessions: number;
  start: string;
  end: string;
}

export interface DashboardStorePeriodStatsDto {
  transactions: number;
  revenue: number;
  start: string;
  end: string;
}

export interface DashboardStoreStatsBlockDto {
  currentMonth: DashboardStoreMonthStatsDto;
  lastMonth: DashboardStorePeriodStatsDto;
  items: { available: number; sold: number };
  growth: { revenue: number };
}

export interface DashboardStoreDto {
  // Pick fields from RecycleryDto
  id: RecycleryDto["id"];
  name: RecycleryDto["name"];
  address?: RecycleryDto["address"];
  phone?: RecycleryDto["phone"];
  email?: RecycleryDto["email"];
  stats: DashboardStoreStatsBlockDto;
}

export interface DashboardStoreHistoryDto {
  id: number;
  name: string;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  stats: DashboardStoreStatsBlockDto[];
}

export type DashboardStatsResponse = ApiDataResponse<DashboardStatsDto>;
export type DashboardActivitiesResponse = ApiDataResponse<DashboardActivityDto[]>;
export type DashboardChartsResponse = ApiDataResponse<DashboardChartsDto>;
export type DashboardStoreStatsResponse = ApiDataResponse<DashboardStoreDto[]>;
export type DashboardStoreHistoryResponse = ApiDataResponse<DashboardStoreHistoryDto>;
