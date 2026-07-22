import type { CollectionPointType } from "../enums/index.js";
import type {
  AlphanumericString,
  EmailAddress,
  FrenchPhoneNumber,
  FrenchPostalCode,
  IsoDateTime,
} from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { RecycleryBaseDto, RecycleryRefDto } from "./recycleries.js";
import type { TaskScheduleRefDto } from "./taskSchedule.js";

export interface CollectionPointBaseDto {
  id: number;
  name: string;
  address: string | null;
  city: string | null;
  postal_code: FrenchPostalCode | null;
  contact_person: AlphanumericString | null;
  contact_phone: FrenchPhoneNumber | null;
  contact_email: EmailAddress | null;
  type: CollectionPointType;
  notes: string | null;
  is_active: boolean;
  recyclery_id: RecycleryBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface CollectionPointDto extends CollectionPointBaseDto {
  Recyclery?: RecycleryRefDto | null | undefined;
  TaskSchedules?: TaskScheduleRefDto[] | undefined;
}

export type CollectionPointRefDto = Pick<
  CollectionPointBaseDto,
  "id" | "name" | "city" | "is_active"
>;

export interface CollectionPointStatsDto {
  total_collections: number;
  completed_collections: number;
  planned_collections: number;
  cancelled_collections: number;
}

export type ListCollectionPointsResponse = ApiDataResponse<CollectionPointDto[]>;
export type DetailCollectionPointResponse = ApiDataResponse<CollectionPointDto>;
export type CreateCollectionPointResponse = ApiDataResponse<CollectionPointDto>;
export type UpdateCollectionPointResponse = ApiDataResponse<CollectionPointDto>;
export type DeleteCollectionPointResponse = ApiMessageResponse;
export type CollectionPointStatsResponse =
  ApiDataResponse<CollectionPointStatsDto>;
