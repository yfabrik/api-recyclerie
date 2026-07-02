import type { ConditionState, LabeledItemStatus } from "../enums/index.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type { CategoryDto, CategoryRefDto } from "./categories.js";
import type { RecycleryDto, RecycleryRefDto } from "./recycleries.js";
import type { UserDto, UserRefDto } from "./users.js";

/** Category ref expanded with direct children (e.g. items `include=category.subcategories`). */
export interface LabeledItemCategoryDto extends CategoryRefDto {
  subcategories?: CategoryRefDto[];
}

export interface LabeledItemDto {
  id: number;
  barcode: string;
  description?: string | null;
  weight: number;
  price: number;
  cost?: number | null;
  condition_state: ConditionState;
  status: LabeledItemStatus;
  category_id: CategoryDto["id"];
  subcategory_id?: CategoryDto["id"] | null;
  recyclery_id?: RecycleryDto["id"] | null;
  created_by?: UserDto["id"] | null;
  createdAt: string;
  updatedAt: string;
  category?: LabeledItemCategoryDto;
  subcategory?: CategoryRefDto | null;
  recyclery?: RecycleryRefDto | null;
  createdBy?: UserRefDto | null;
}

export interface LabeledItemStatsDto {
  total_items?: number | string;
  available_items?: number | string | null;
  sold_items?: number | string | null;
  reserved_items?: number | string | null;
  total_value?: number | string | null;
}

export type ListLabeledItemsResponse = ApiPaginatedResponse<LabeledItemDto>;
export type DetailLabeledItemResponse = ApiDataResponse<LabeledItemDto>;
export type CreateLabeledItemResponse = ApiDataResponse<LabeledItemDto>;
export type UpdateLabeledItemResponse = ApiDataResponse<LabeledItemDto>;
export type DeleteLabeledItemResponse = ApiMessageResponse;
export type TagLabeledItemSoldResponse = ApiMessageResponse;
export type LabeledItemStatsResponse = ApiDataResponse<LabeledItemStatsDto | null>;
