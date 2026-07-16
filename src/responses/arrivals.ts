import type { ArrivalSourceType, ArrivalStatus } from "../enums/index.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type { CategoryDto, CategoryRefDto } from "./categories.js";
import type {
  CollectionPointDto,
  CollectionPointRefDto,
} from "./collectionPoints.js";
import type { UserDto, UserRefDto } from "./users.js";

//TODO can we make the type require collectionpointid only if source_type is point ?
export interface ArrivalDto {
  id: number;
  weight: number;
  arrival_date: string;
  arrival_time?: string | null;//TODO can be undefined ?
  source_type: ArrivalSourceType;
  source_details?: string | null;
  notes?: string | null;
  status: ArrivalStatus;
  processed_by: UserDto["id"];
  category_id: CategoryDto["id"];
  subcategory_id?: CategoryDto["id"] | null;
  collection_point_id?: CollectionPointDto["id"] | null;
  createdAt: string;
  updatedAt: string;
  categorie?: CategoryRefDto;
  subcategorie?: CategoryRefDto | null;
  User?: UserRefDto;
  CollectionPoint?: CollectionPointRefDto | null;
}

export interface ArrivalStatsDto {
  total_arrivals?: number | string;
  total_weight?: number | string | null;
  from_collection_points?: number | string | null;
  volunteer_donations?: number | string | null;
  house_clearances?: number | string | null;
  pending_processing?: number | string | null;
  processed?: number | string | null;
}

export interface ArrivalCategoryStatsDto {
  count?: number | string;
  total_weight?: number | string | null;
  categorie?: CategoryRefDto;
}

export type ListArrivalsResponse = ApiPaginatedResponse<ArrivalDto>;
export type DetailArrivalResponse = ApiDataResponse<ArrivalDto>;
export type CreateArrivalResponse = ApiDataResponse<ArrivalDto>;
export type UpdateArrivalResponse = ApiMessageResponse;
export type DeleteArrivalResponse = ApiMessageResponse;
export type ArrivalStatsResponse = ApiDataResponse<ArrivalStatsDto>;
export type ArrivalCategoryStatsResponse = ApiDataResponse<ArrivalCategoryStatsDto[]>;
