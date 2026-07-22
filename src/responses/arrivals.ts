import type { ArrivalSourceType, ArrivalStatus } from "../enums/index.js";
import type { IsoDateTime, IsoTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type { CategoryBaseDto, CategoryRefDto } from "./categories.js";
import type {
  CollectionPointBaseDto,
  CollectionPointRefDto,
} from "./collectionPoints.js";
import type { UserBaseDto, UserRefDto } from "./users.js";

//TODO can we make the type require collectionpointid only if source_type is point ?
export interface ArrivalBaseDto {
  id: number;
  weight: number;
  arrival_date: IsoDateTime;
  arrival_time: IsoTime | null;
  source_type: ArrivalSourceType;
  source_details: string | null;
  notes: string | null;
  status: ArrivalStatus;
  processed_by: UserBaseDto["id"];
  category_id: CategoryBaseDto["id"];
  subcategory_id: CategoryBaseDto["id"] | null;
  collection_point_id: CollectionPointBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface ArrivalDto extends ArrivalBaseDto {
  //TODO stop using ref
  categorie?: CategoryRefDto | undefined;
  subcategorie?: CategoryRefDto | null | undefined;
  User?: UserRefDto | undefined;
  CollectionPoint?: CollectionPointRefDto | null | undefined;
}

export interface ArrivalStatsDto {
  total_arrivals?: number | undefined;
  total_weight?: number | null | undefined;
  from_collection_points?: number | null | undefined;
  volunteer_donations?: number | null | undefined;
  house_clearances?: number | null | undefined;
  pending_processing?: number | null | undefined;
  processed?: number | null | undefined;
}

export interface ArrivalCategoryStatsDto {
  count?: number | undefined;
  total_weight?: number | null | undefined;
  categorie?: CategoryRefDto | undefined;
}

export type ListArrivalsResponse = ApiPaginatedResponse<ArrivalDto>;
export type DetailArrivalResponse = ApiDataResponse<ArrivalDto>;
export type CreateArrivalResponse = ApiDataResponse<ArrivalDto>;
export type UpdateArrivalResponse = ApiMessageResponse;
export type DeleteArrivalResponse = ApiMessageResponse;
export type ArrivalStatsResponse = ApiDataResponse<ArrivalStatsDto>;
export type ArrivalCategoryStatsResponse = ApiDataResponse<ArrivalCategoryStatsDto[]>;
