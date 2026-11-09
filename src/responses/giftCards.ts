import type {
  GiftCardStatus,
  GiftCardTransactionType,
} from "../enums/index.js";
import type { AlphanumericString, EmailAddress, IsoDateTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type { SalesAnalyticsResponse } from "./salesAnalytics.js";
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

/** How many cards (or movements) and how much, in euros rounded to the cent, always positive. */
export interface GiftCardFigureDto {
  count: number;
  amount: number;
}

/**
 * `GET /gift-cards/analytics`, from the gift card ledger. With a Store
 * selected, the lines traced to a Store through their transaction's cash
 * session are filtered (`sold`, `store_credit`, `top_up`, `used`); the others
 * are network-wide ("tous magasins"). Those movement lines count only the
 * movements of completed transactions; `expired` and `outstanding` read the
 * card's own ledger balance, whatever its transactions' status.
 */
export interface GiftCardAnalyticsDto {
  /** Value put on gift cards in the range, by origin. */
  issued: {
    /** Cards created on the Gift card page: no `issue` movement; `issued_at`, `initial_value`. Network-wide. Count = cards. */
    by_hand: GiftCardFigureDto;
    /** Cards sold through a Sale: `issue` movement on a `sell`. Count = cards. */
    sold: GiftCardFigureDto;
    /** Store credit from a Refund: a card issued by a Refund, or a Refund credited onto a card. Count = credits. */
    store_credit: GiftCardFigureDto;
    /** Top-ups from the Gift card page: `refund_recredit` movement on a `sell`, not a Refund. Count = top-ups. */
    top_up: GiftCardFigureDto;
  };
  /** Paid with gift cards: `charge` movements. Count = uses. */
  used: GiftCardFigureDto;
  /** Cards whose `expires_at` falls in the range, with the balance left then. Network-wide. Count = cards. */
  expired: GiftCardFigureDto;
  /**
   * Balance left on cards at the end of `date_to` (Paris), network-wide. A
   * card counts from its issue until it expires or is cancelled (its last
   * update). Count = cards with a balance.
   */
  outstanding: GiftCardFigureDto;
}

export type GiftCardAnalyticsResponse = SalesAnalyticsResponse<GiftCardAnalyticsDto>;
