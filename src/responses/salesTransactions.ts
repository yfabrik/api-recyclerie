import type {
  CashSessionStatus,
  PaymentMethod,
  PromotionType,
  SalesPaymentMethod,
  SalesTransactionStatus,
  TransactionType,
} from "../enums/index.js";
import type {
  EmailAddress,
  FrenchPostalCode,
} from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type {
  CashRegisterDto,
  CashRegisterSessionRefDto,
} from "./cashRegister.js";
import type { CashSessionDto } from "./cashSession.js";
import type { CategoryDto } from "./categories.js";
import type { GiftCardDto, GiftCardSummaryDto } from "./giftCards.js";
import type { LabeledItemDto } from "./items.js";
import type { UserDto, UserRefDto } from "./users.js";

export type { GiftCardSummaryDto };

export interface TransactionPaymentDto {
  id: number;
  method: PaymentMethod;
  amount: number;
  metadata?: Record<string, unknown> | null;
  gift_card_id?: GiftCardDto["id"] | null;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionGlobalPromotionDto {
  id: number;
  value: number;
  type: PromotionType;
  createdAt: string;
  updatedAt: string;
}

/** Per-line sale data from the `TransactionItem` join (quantity, line price, promo, bundle). */
export interface TransactionItemLineDto {
  name: string;
  price: number;
  quantity: number;
  promotionValue: number;
  bundleQuantity?: number | null;
  bundlePrice?: number | null;
  total_price: number;
  createdAt: string;
  updatedAt: string;
}

/** A labeled item as it appears inside a sale, carrying its `TransactionItem` line data. */
export interface SalesTransactionItemDto extends LabeledItemDto {
  TransactionItem?: TransactionItemLineDto | null;
}

export interface SalesTransactionCashSessionDto {
  id: number;
  opening_amount: number;
  closing_amount?: number | null;
  expected_amount?: number | null;
  status: CashSessionStatus;
  cash_register_id: CashRegisterDto["id"];
  user_id: UserDto["id"];
  CashRegister?: CashRegisterSessionRefDto | null;
  User?: UserRefDto | null;
}

export interface SalesTransactionDto {
  id: number;
  total_amount_before_promotion: number;
  total_amount: number;
  payment_method: SalesPaymentMethod;
  transactionType: TransactionType;
  payment_amount: number;
  change_amount?: number;
  global_promotion?: number | null;
  global_promotion_type?: PromotionType | null;
  customer_name?: string | null;
  customer_email?: EmailAddress | null;
  customer_postal_code?: FrenchPostalCode | null;
  status: SalesTransactionStatus;
  cash_session_id: CashSessionDto["id"];
  created_by: UserDto["id"];
  transactionId?: SalesTransactionDto["id"] | null;
  createdAt: string;
  updatedAt: string;
  items?: SalesTransactionItemDto[];
  payments?: TransactionPaymentDto[];
  globalPromotions?: TransactionGlobalPromotionDto[];
  CashSession?: SalesTransactionCashSessionDto | null;
  User?: UserRefDto | null;
  refunds?: SalesTransactionDto[];
  giftCards?: GiftCardSummaryDto[];
}

export interface SalesTransactionStatsDto {
  total_transactions: number;
  total_sales: number | string;
  total_sales_before_refunds: number | string;
  average_transaction: number | string;
  sessions_count: number | string;
  total_refunded: number;
  payment_methods: {
    payment_method: string;
    total: number | string;
    count: number | string;
  }[];
  by_day: {
    date: string;
    transaction_count: number;
    total_amount: number;
  }[];
  by_category: {
    category_id: CategoryDto["id"] | string | null;
    category_name: string | null;
    total_quantity: number;
    total_price_sum: number;
  }[];
}

export interface PostalCodeStatsDto {
  customer_postal_code: FrenchPostalCode | null;
  transaction_count: number | string;
  average_transaction: number | string;
  total_sales: number | string;
}

export interface CreateSaleTransactionResultDto {
  id: number;
  transaction: SalesTransactionDto;
}

export interface CreateRefundResultDto {
  refund: SalesTransactionDto;
  giftCard?: GiftCardSummaryDto;
}

export interface ListRefundsResultDto {
  refunds: SalesTransactionDto[];
  parent: SalesTransactionDto;
}

export type ListSalesTransactionsResponse = ApiPaginatedResponse<SalesTransactionDto>;
export type DetailSalesTransactionResponse = ApiDataResponse<SalesTransactionDto>;
export type CreateSalesTransactionResponse = ApiDataResponse<CreateSaleTransactionResultDto>;
export type CreateRefundResponse = ApiDataResponse<CreateRefundResultDto>;
export type ListRefundsResponse = ApiDataResponse<ListRefundsResultDto>;
export type SalesTransactionStatsResponse = ApiDataResponse<SalesTransactionStatsDto>;
export type PostalCodeStatsResponse = ApiDataResponse<PostalCodeStatsDto[]>;
export type UpdateSalesTransactionResponse = ApiDataResponse<SalesTransactionDto>;
export type DeleteSalesTransactionResponse = ApiMessageResponse;
