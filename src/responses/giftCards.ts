import type {
  GiftCardStatus,
  GiftCardTransactionType,
} from "../enums/index.js";
import type { AlphanumericString, EmailAddress } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type { SalesTransactionDto } from "./salesTransactions.js";
import type { UserDto } from "./users.js";

export interface GiftCardTransactionDto {
  gift_card_id: GiftCardDto["id"];
  sales_transaction_id: SalesTransactionDto["id"];
  type: GiftCardTransactionType;
  amount: number;
  occurred_at?: string;
  metadata?: Record<string, unknown> | null;
  created_by: UserDto["id"];
  createdAt: string;
  updatedAt: string;
}

export interface GiftCardDto {
  id: number;
  code: string;
  initial_value: number;
  /** Virtual: sum of ledger movements when movements are loaded. */
  current_value?: number;
  expires_at?: string | null;
  status: GiftCardStatus;
  currency?: string;
  issued_at?: string;
  note?: string | null;
  recipient_name?: AlphanumericString | null;
  recipient_email?: EmailAddress | null;
  issued_transaction_id?: SalesTransactionDto["id"] | null;
  issued_refund_transaction_id?: SalesTransactionDto["id"] | null;
  created_by?: UserDto["id"] | null;
  createdAt: string;
  updatedAt: string;
  movements?: GiftCardTransactionDto[];
}

export interface GiftCardBalanceDto {
  id: number;
  code: string;
  initial_value: number;
  movement_sum: number;
  current_balance: number;
}

/** Compact card ref for nested responses (e.g. refunds). */
export type GiftCardSummaryDto = Pick<GiftCardDto, "id" | "code" | "status"> & {
  currentBalance?: number;
};

export type ListGiftCardsResponse = ApiPaginatedResponse<GiftCardDto>;
export type CreateGiftCardResponse = ApiDataResponse<GiftCardDto>;
export type DetailGiftCardResponse = ApiDataResponse<GiftCardDto>;
export type GiftCardBalanceResponse = ApiDataResponse<GiftCardBalanceDto>;
export type CreateGiftCardMovementResponse =
  ApiDataResponse<GiftCardTransactionDto>;
