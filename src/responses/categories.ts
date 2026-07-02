import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { PromotionDto } from "./promotions.js";

export interface CategoryDto {
  id: number;
  name: string;
  description?: string | null;
  icon?: string | null;
  parent_id?: CategoryDto["id"] | null;
  defaultWeight?: number;
  defaultPrice?: number;
  IO?: number;
  priceBasedOnWeight?: boolean;
  bundleQuantity?: number | null;
  bundlePrice?: number | null;
  createdAt: string;
  updatedAt: string;
  subcategories?: CategoryDto[];
  parent?: CategoryDto;
  Promotions?: PromotionDto[];
}

export type CategoryRefDto = Pick<
  CategoryDto,
  "id" | "name" | "description" | "icon" | "parent_id"
>;

export type ListCategoriesResponse = ApiDataResponse<CategoryDto[]>;
export type CreateCategoryResponse = ApiDataResponse<CategoryDto>;
export type UpdateCategoryResponse = ApiDataResponse<CategoryDto>;
export type DeleteCategoryResponse = ApiMessageResponse;
export type PatchCategoryResponse = ApiMessageResponse;
