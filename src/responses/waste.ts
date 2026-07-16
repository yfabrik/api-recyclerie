import type { WasteDisposalType } from "../enums/index.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
  ApiPaginatedResponse,
} from "../types/response.js";
import type { CategoryDto, CategoryRefDto } from "./categories.js";
import type { EcoOrganismDto, EcoOrganismRefDto } from "./ecoOrganism.js";
import type { UserDto, UserRefDto } from "./users.js";

export type { CategoryRefDto } from "./categories.js";
export type { EcoOrganismRefDto } from "./ecoOrganism.js";
export type { UserRefDto } from "./users.js";

export interface WasteDisposalDto {
  id: number;
  disposal_date: string;
  disposal_type: WasteDisposalType;
  weight_kg: number | string;//TODO 
  volume_m3?: number | string | null;//TODO 
  transport_method?: string | null;
  transport_company?: string | null;
  transport_cost?: number | string | null;//TODO 
  notes?: string | null;
  category_id: CategoryDto["id"];
  subcategory_id?: CategoryDto["id"] | null;
  eco_organism_id?: EcoOrganismDto["id"] | null;
  created_by?: UserDto["id"];
  createdAt: string;
  updatedAt: string;
  category?: CategoryRefDto;
  subcategory?: CategoryRefDto | null;
  eco_organism?: EcoOrganismRefDto | null;
  User?: UserRefDto;
}

export interface WasteStatsDto {
  total_disposals?: number | string;
  total_weight_kg?: number | string | null;
  total_volume_m3?: number | string | null;
  total_transport_cost?: number | string | null;
  eco_organism_disposals?: number | string | null;
  landfill_disposals?: number | string | null;
  other_disposals?: number | string | null;
}

export type ListWasteResponse = ApiPaginatedResponse<WasteDisposalDto>;
export type DetailWasteResponse = ApiDataResponse<WasteDisposalDto>;
export type CreateWasteResponse = ApiDataResponse<WasteDisposalDto>;
export type UpdateWasteResponse = ApiMessageResponse;
export type DeleteWasteResponse = ApiMessageResponse;
export type WasteStatsResponse = ApiDataResponse<WasteStatsDto | null>;
export type WasteStatsCategoryResponse = ApiDataResponse<WasteStatsDto[]>;
