import type { WasteDisposalType } from "../enums/index.js";
import type { IsoDateTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type { CategoryBaseDto, CategoryRefDto } from "./categories.js";
import type { EcoOrganismBaseDto, EcoOrganismRefDto } from "./ecoOrganism.js";
import type { UserBaseDto, UserRefDto } from "./users.js";

export type { CategoryRefDto } from "./categories.js";
export type { EcoOrganismRefDto } from "./ecoOrganism.js";
export type { UserRefDto } from "./users.js";

export interface WasteDisposalBaseDto {
  id: number;
  disposal_date: IsoDateTime;
  disposal_type: WasteDisposalType;
  weight_kg: number;
  volume_m3: number | null;
  transport_method: string | null;
  transport_company: string | null;
  transport_cost: number | null;
  notes: string | null;
  category_id: CategoryBaseDto["id"];
  subcategory_id: CategoryBaseDto["id"] | null;
  eco_organism_id: EcoOrganismBaseDto["id"] | null;
  created_by: UserBaseDto["id"];
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface WasteDisposalDto extends WasteDisposalBaseDto {
  category?: CategoryRefDto | undefined;
  subcategory?: CategoryRefDto | null | undefined;
  eco_organism?: EcoOrganismRefDto | null | undefined;
  User?: UserRefDto | undefined;
}

export interface WasteStatsDto {
  total_disposals?: number | undefined;
  total_weight_kg?: number | null | undefined;
  total_volume_m3?: number | null | undefined;
  total_transport_cost?: number | null | undefined;
  eco_organism_disposals?: number | null | undefined;
  landfill_disposals?: number | null | undefined;
  other_disposals?: number | null | undefined;
}

export type ListWasteResponse = ApiPaginatedResponse<WasteDisposalDto>;
export type DetailWasteResponse = ApiDataResponse<WasteDisposalDto>;
export type CreateWasteResponse = ApiDataResponse<WasteDisposalDto>;
export type UpdateWasteResponse = ApiMessageResponse;
export type DeleteWasteResponse = ApiMessageResponse;
export type WasteStatsResponse = ApiDataResponse<WasteStatsDto | null>;
export type WasteStatsCategoryResponse = ApiDataResponse<WasteStatsDto[]>;
