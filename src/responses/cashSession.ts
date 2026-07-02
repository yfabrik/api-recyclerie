import type { CashSessionStatus } from "../enums/index.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CashRegisterDto, CashRegisterSessionRefDto } from "./cashRegister.js";
import type { RecycleryRefDto } from "./recycleries.js";
import type { UserDto, UserRefDto } from "./users.js";
import type { SalesTransactionDto } from "./salesTransactions.js";

export interface CashSessionDto {
  id: number;
  opening_amount: number;
  closing_amount?: number | null;
  expected_amount?: number | null;
  /** Virtual: closing − expected when status is `close`, otherwise 0. */
  difference_amount?: number;
  status: CashSessionStatus;
  notes?: string | null;
  closed_at?: string | null;
  cash_register_id: CashRegisterDto["id"];
  user_id: UserDto["id"];
  createdAt: string;
  updatedAt: string;
  transactions_count?: number | string;
  total_sales?: number | string;
  CashRegister?: CashRegisterSessionRefDto | null;
  Recyclery?: RecycleryRefDto | null;
  User?: UserRefDto | null;
  SalesTransactions?: SalesTransactionDto[];
}

export interface CloseCashSessionResultDto {
  expected_amount: number;
  difference_amount: number;
}

export interface CashSessionStatsItemDto {
  transactions: number;
  cash: { count: number; value: number };
  card: { count: number; value: number };
  categories: { category: string; sub: string; value: number }[];
}

export type ListCashSessionsResponse = ApiDataResponse<CashSessionDto[]>;
export type ActiveCashSessionResponse = ApiDataResponse<CashSessionDto | null>;
export type OpenCashSessionResponse = ApiDataResponse<CashSessionDto>;
export type CloseCashSessionResponse = ApiMessageResponse & CloseCashSessionResultDto;
export type DetailCashSessionResponse = ApiDataResponse<CashSessionDto>;
export type CashSessionsStatsResponse = ApiDataResponse<CashSessionStatsItemDto[]>;
