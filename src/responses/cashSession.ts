import type { CashSessionStatus } from "../enums/index.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CashRegisterBaseDto, CashRegisterSessionRefDto } from "./cashRegister.js";
import type { UserBaseDto, UserRefDto } from "./users.js";
import type { SalesTransactionDto } from "./salesTransactions.js";
import type { IsoDateTime } from "../primitives/zod.js";

export interface CashSessionBaseDto {
  id: number;
  opening_amount: number;
  closing_amount: number | null;
  expected_amount: number | null;
  status: CashSessionStatus;
  notes: string | null;
  closed_at: IsoDateTime | null;
  cash_register_id: CashRegisterBaseDto["id"];
  user_id: UserBaseDto["id"];
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface CashSessionDto extends CashSessionBaseDto {
  /** Virtual: closing − expected when status is `close`, otherwise 0. */
  difference_amount?: number | undefined;
  /** List-query aggregate (`COUNT` of sales). */
  transactions_count?: number | undefined;
  /** List-query aggregate (`SUM` of sales totals). */
  total_sales?: number | undefined;
  CashRegister?: CashRegisterSessionRefDto | null | undefined;
  // Recyclery?: RecycleryRefDto | null | undefined;//TODO used somewhere ? i only get it through cashregister
  User?: UserRefDto | null | undefined;
  SalesTransactions?: SalesTransactionDto[] | undefined;
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

export type CashSessionRefDto = CashSessionBaseDto;

export type ListCashSessionsResponse = ApiDataResponse<CashSessionDto[]>;
export type ActiveCashSessionResponse = ApiDataResponse<CashSessionDto | null>;
export type OpenCashSessionResponse = ApiDataResponse<CashSessionDto>;
export type CloseCashSessionResponse = ApiMessageResponse & CloseCashSessionResultDto;
export type DetailCashSessionResponse = ApiDataResponse<CashSessionDto>;
export type CashSessionsStatsResponse = ApiDataResponse<CashSessionStatsItemDto[]>;
