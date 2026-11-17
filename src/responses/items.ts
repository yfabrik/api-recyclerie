import type { ConditionState, LabeledItemStatus } from "../enums/index.js";
import type { IsoDateTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type { CategoryBaseDto, CategoryRefDto } from "./categories.js";
import type { RecycleryBaseDto, RecycleryRefDto } from "./recycleries.js";
import type { UserBaseDto, UserRefDto } from "./users.js";

/** Category ref expanded with direct children (e.g. items `include=category.subcategories`). */
export interface LabeledItemCategoryDto extends CategoryRefDto {
  subcategories?: CategoryRefDto[] | undefined;
}

export interface LabeledItemBaseDto {
  id: number;
  description: string | null;
  weight: number;
  price: number;
  cost: number | null;
  condition_state: ConditionState;
  status: LabeledItemStatus;
  category_id: CategoryBaseDto["id"];
  subcategory_id: CategoryBaseDto["id"] | null;
  recyclery_id: RecycleryBaseDto["id"] | null;
  created_by: UserBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface LabeledItemDto extends LabeledItemBaseDto {
  /** Virtual: zero-padded id used as barcode. */
  barcode: string;
  category?: LabeledItemCategoryDto | undefined;
  subcategory?: CategoryRefDto | null | undefined;
  recyclery?: RecycleryRefDto | null | undefined;
  createdBy?: UserRefDto | null | undefined;
}

/** A labeled item as the item endpoints return it (list, barcode lookup, create, update). */
export interface LabeledItemWithSaleDto extends LabeledItemDto {
  /** Most recent Sale listing the item; Refunds never count. `null` when no Sale lists it. */
  sale_id: number | null;
}

export interface LabeledItemStatsDto {
  total_items?: number | undefined;
  available_items?: number | null | undefined;
  sold_items?: number | null | undefined;
  reserved_items?: number | null | undefined;
  total_value?: number | null | undefined;
}

export type ListLabeledItemsResponse = ApiPaginatedResponse<LabeledItemWithSaleDto>;
export type DetailLabeledItemResponse = ApiDataResponse<LabeledItemWithSaleDto>;
export type CreateLabeledItemResponse = ApiDataResponse<LabeledItemWithSaleDto[]>;
export type UpdateLabeledItemResponse = ApiDataResponse<LabeledItemWithSaleDto>;
export type DeleteLabeledItemResponse = ApiMessageResponse;
export type TagLabeledItemSoldResponse = ApiMessageResponse;
/** `POST /api/labeled-items/:id/available`: the reverse of mark-as-sold. */
export type TagLabeledItemAvailableResponse = ApiMessageResponse;
export type LabeledItemStatsResponse = ApiDataResponse<LabeledItemStatsDto | null>;
