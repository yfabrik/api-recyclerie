import type {
  GiftCardStatus,
  GiftCardTransactionType,
} from "../enums/index.js";
import type { AlphanumericString, EmailAddress, IsoDateTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type { SalesTransactionBaseDto } from "./salesTransactions.js";
import type { UserBaseDto } from "./users.js";

export interface GiftCardTransactionBaseDto {
  gift_card_id: GiftCardBaseDto["id"];
  sales_transaction_id: SalesTransactionBaseDto["id"];
  type: GiftCardTransactionType;
  amount: number;
  occurred_at: IsoDateTime;
  metadata: Record<string, unknown> | null;
  created_by: UserBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface GiftCardTransactionDto extends GiftCardTransactionBaseDto {}

export interface GiftCardBaseDto {
  id: number;
  code: string;
  initial_value: number;
  expires_at: IsoDateTime | null;
  status: GiftCardStatus;
  currency: string;
  issued_at: IsoDateTime;
  note: string | null;
  recipient_name: AlphanumericString | null;
  recipient_email: EmailAddress | null;
  issued_transaction_id: SalesTransactionBaseDto["id"] | null;
  issued_refund_transaction_id: SalesTransactionBaseDto["id"] | null;
  created_by: UserBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface GiftCardDto extends GiftCardBaseDto {
  /** Virtual: sum of ledger movements when movements are loaded. */
  current_value?: number | undefined;
  movements?: GiftCardTransactionDto[] | undefined;
}

export interface GiftCardBalanceDto {
  id: number;
  code: string;
  initial_value: number;
  movement_sum: number;
  current_balance: number;
}

/** Compact card ref for nested responses (e.g. refunds). */
export type GiftCardSummaryDto = Pick<GiftCardBaseDto, "id" | "code" | "status"> & {
  currentBalance?: number | undefined;
};

export type ListGiftCardsResponse = ApiPaginatedResponse<GiftCardDto>;
export type CreateGiftCardResponse = ApiDataResponse<GiftCardDto>;
export type DetailGiftCardResponse = ApiDataResponse<GiftCardDto>;
export type GiftCardBalanceResponse = ApiDataResponse<GiftCardBalanceDto>;
export type CreateGiftCardMovementResponse =
  ApiDataResponse<GiftCardTransactionDto>;
