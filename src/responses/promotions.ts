import type { IsoDate, IsoDateTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CategoryBaseDto, CategoryRefDto } from "./categories.js";
import type { RecycleryRefDto } from "./recycleries.js";

export interface PromotionBaseDto {
  id: number;
  startDate: IsoDate;
  endDate: IsoDate | null;
  isActive: boolean;
  promotionValue: number; //TODO can only be 0-100
  category_id: CategoryBaseDto["id"];
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface PromotionDto extends PromotionBaseDto {
  Category?: CategoryRefDto | undefined;
  stores?: RecycleryRefDto[] | undefined;
}

export type ListPromotionsResponse = ApiDataResponse<PromotionDto[]>;
export type CreatePromotionResponse = ApiDataResponse<PromotionDto>;
export type UpdatePromotionResponse = ApiDataResponse<PromotionDto>;
export type DeletePromotionResponse = ApiMessageResponse;
