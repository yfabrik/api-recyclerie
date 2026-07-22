import type { IsoDateTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { PromotionDto } from "./promotions.js";

export interface CategoryBaseDto {
  id: number;
  name: string;
  description: string | null;
  icon: string | null;
  parent_id: CategoryBaseDto["id"] | null;
  defaultWeight: number;
  defaultPrice: number;
  IO: number;
  priceBasedOnWeight: boolean;
  bundleQuantity: number | null;
  bundlePrice: number | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface CategoryDto extends CategoryBaseDto {
  subcategories?: CategoryDto[] | undefined;
  parent?: CategoryDto | undefined;
  Promotions?: PromotionDto[] | undefined;
}

export type CategoryRefDto = Pick<
  CategoryBaseDto,
  "id" | "name" | "description" | "icon" | "parent_id"
>;

export type ListCategoriesResponse = ApiDataResponse<CategoryDto[]>;
export type CreateCategoryResponse = ApiDataResponse<CategoryDto>;
export type UpdateCategoryResponse = ApiDataResponse<CategoryDto>;
export type DeleteCategoryResponse = ApiMessageResponse;
export type PatchCategoryResponse = ApiMessageResponse;
