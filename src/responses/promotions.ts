import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CategoryDto, CategoryRefDto } from "./categories.js";
import type { RecycleryRefDto } from "./recycleries.js";

export interface PromotionDto {
  id: number;
  startDate: string;
  endDate: string | null;
  isActive: boolean;
  promotionValue: number;//TODO can only be 0-100
  category_id: CategoryDto["id"];
  createdAt: string;
  updatedAt: string;
  Category?: CategoryRefDto;
  stores?: RecycleryRefDto[];
}

export type ListPromotionsResponse = ApiDataResponse<PromotionDto[]>;
export type CreatePromotionResponse = ApiDataResponse<PromotionDto>;
export type UpdatePromotionResponse = ApiDataResponse<PromotionDto>;
export type DeletePromotionResponse = ApiMessageResponse;
