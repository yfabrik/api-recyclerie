import type {
  PaymentMethod,
  PromotionType,
  SalesPaymentMethod,
  SalesTransactionStatus,
  TransactionType
} from "../enums/index.js";
import type {
  EmailAddress,
  FrenchPostalCode,
  IsoDateTime,
} from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type { CashSessionBaseDto, CashSessionDto } from "./cashSession.js";
import type { CategoryBaseDto } from "./categories.js";
import type { GiftCardBaseDto, GiftCardSummaryDto } from "./giftCards.js";
import type { LabeledItemDto } from "./items.js";
import type { UserBaseDto, UserRefDto } from "./users.js";

export type { GiftCardSummaryDto };

export interface TransactionPaymentBaseDto {
  id: number;
  method: PaymentMethod;
  amount: number;
  metadata: Record<string, unknown> | null;
  sales_transaction_id: SalesTransactionBaseDto["id"];
  gift_card_id: GiftCardBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface TransactionPaymentDto extends TransactionPaymentBaseDto {}

export interface TransactionGlobalPromotionBaseDto {
  id: number;
  value: number;
  type: PromotionType;
  transaction_id: SalesTransactionBaseDto["id"];
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface TransactionGlobalPromotionDto extends TransactionGlobalPromotionBaseDto {}

/** Per-line sale data from the `TransactionItem` join (quantity, line price, promo, bundle). */
export interface TransactionItemLineDto {
  name: string;
  price: number;
  quantity: number;
  promotionValue: number;
  bundleQuantity: number | null;
  bundlePrice: number | null;
  total_price: number;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

/** A labeled item as it appears inside a sale, carrying its `TransactionItem` line data. */
export interface SalesTransactionItemDto extends LabeledItemDto {
  TransactionItem: TransactionItemLineDto ;
}

export interface SalesTransactionBaseDto {
  id: number;
  total_amount_before_promotion: number;
  total_amount: number;
  payment_method: SalesPaymentMethod;
  transactionType: TransactionType;
  payment_amount: number;
  customer_name: string | null;
  customer_email: EmailAddress | null;
  customer_postal_code: FrenchPostalCode | null;
  status: SalesTransactionStatus;
  cash_session_id: CashSessionBaseDto["id"];
  created_by: UserBaseDto["id"] | null;
  transactionId: SalesTransactionBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface SalesTransactionDto extends SalesTransactionBaseDto {
  /** Virtual: payment − total. */
  change_amount?: number | undefined;
  /** Virtual: from first `globalPromotions` row. */
  global_promotion: number | null;
  /** Virtual: from first `globalPromotions` row. */
  global_promotion_type: PromotionType | null;
  items?: SalesTransactionItemDto[] | undefined;
  payments?: TransactionPaymentDto[] | undefined;
  globalPromotions?: TransactionGlobalPromotionDto[] | undefined;
  CashSession?: CashSessionDto | null | undefined;
  User?: UserRefDto | null | undefined;
  refunds?: SalesTransactionDto[] | undefined;
  giftCards?: GiftCardSummaryDto[] | undefined;//TODO wht not ref
}

export interface SalesTransactionStatsDto {
  total_transactions: number;
  total_sales: number;
  total_sales_before_refunds: number;
  average_transaction: number;
  sessions_count: number;
  total_refunded: number;
  payment_methods: {
    payment_method: PaymentMethod;
    total: number;
    count: number;
  }[];
  by_day: {
    date: string;
    transaction_count: number;
    total_amount: number;
  }[];
  by_category: {
    category_id: CategoryBaseDto["id"] | null;
    category_name: CategoryBaseDto["name"] | null;
    total_quantity: number;
    total_price_sum: number;
  }[];
}

export interface PostalCodeStatsDto {
  customer_postal_code: FrenchPostalCode;
  transaction_count: number;
  average_transaction: number;
  total_sales: number;
}

export interface CreateSaleTransactionResultDto {
  id: number;
  transaction: SalesTransactionDto;
}

export interface CreateRefundResultDto {
  refund: SalesTransactionDto;
  giftCard?: GiftCardSummaryDto | undefined;
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
