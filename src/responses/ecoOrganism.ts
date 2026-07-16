import type {
  ArrivalSourceType,
  EcoOrgQuarterMonthRangeLabel,
} from "../enums/index.js";
import type {
  EmailAddress,
  FrenchPhoneNumber,
  Url,
} from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CategoryRefDto } from "./categories.js";
import type { WasteDisposalDto } from "./waste.js";

export interface EcoOrganismDto {
  id: number;
  name: string;
  description?: string | null;
  contact_email?: EmailAddress | null;
  contact_phone?: FrenchPhoneNumber | null;
  address?: string | null;
  website?: Url | null;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
  inCategories?: CategoryRefDto[];
  sellCategories?: CategoryRefDto[];
  WasteDisposals?: WasteDisposalDto[];
}

export type EcoOrganismRefDto = Pick<
  EcoOrganismDto,
  | "id"
  | "name"
  | "description"
  | "contact_email"
  | "contact_phone"
  | "is_active"
>;

//TODO should all be number ?
export interface EcoOrganismStatsDto {
  total_eco_organisms?: number | string;
  active_eco_organisms?: number | string | null;
  inactive_eco_organisms?: number | string | null;
}

export type EcoOrgQuarterLabel = `${number}-T${1 | 2 | 3 | 4}`;

export interface EcoOrgWeightedCategoryDto {
  id: number;
  name: string;
  weight_kg: number;
}

export interface EcoOrgQuarterCategoryBreakdownDto {
  total_weight_kg: number;
  categories: (EcoOrgWeightedCategoryDto & {
    subcategories: EcoOrgWeightedCategoryDto[];
  })[];
  /** Month range label, e.g. "01-2026--03-2026" */
  labelMMYYYY?: EcoOrgQuarterMonthRangeLabel;//TODO not used anymore
}

export type EcoOrgQuarterInBySourceTypeDto = Record<
  ArrivalSourceType,
  EcoOrgQuarterCategoryBreakdownDto
>;

export interface EcoOrgQuarterInBreakdownDto
  extends EcoOrgQuarterCategoryBreakdownDto {
  by_source_type: EcoOrgQuarterInBySourceTypeDto;
}

export interface EcoOrgSellCategoryBreakdownDto {
  id: number;
  name: string;
  weight_kg: number;
  quantity: number;
  subcategories: (EcoOrgWeightedCategoryDto & { quantity: number })[];
}

export interface EcoOrgQuarterSellBreakdownDto {
  total_weight_kg: number;
  quantity: number;
  categories: EcoOrgSellCategoryBreakdownDto[];
}

export interface EcoOrgQuarterPeriodDto {
  quarter: EcoOrgQuarterLabel;
  quarterOut: EcoOrgQuarterCategoryBreakdownDto;
  quarterIn: EcoOrgQuarterInBreakdownDto;
  quarterSell: EcoOrgQuarterSellBreakdownDto;
}

export interface EcoOrgQuarterStatsDto {
  id: number;
  name: string;
  description?: string | null;
  is_active: boolean;
  quarters: EcoOrgQuarterPeriodDto[];
}

export const EMPTY_ECO_ORG_QUARTER_CATEGORY_BREAKDOWN: EcoOrgQuarterCategoryBreakdownDto =
  {
    total_weight_kg: 0,
    categories: [],
  };

export const EMPTY_ECO_ORG_QUARTER_IN_BREAKDOWN: EcoOrgQuarterInBreakdownDto = {
  total_weight_kg: 0,
  categories: [],
  by_source_type: {
    point: { total_weight_kg: 0, categories: [] },
    apport: { total_weight_kg: 0, categories: [] },
    house_clearance: { total_weight_kg: 0, categories: [] },
  },
};

export const EMPTY_ECO_ORG_QUARTER_SELL_BREAKDOWN: EcoOrgQuarterSellBreakdownDto =
  {
    total_weight_kg: 0,
    quantity: 0,
    categories: [],
  };

export type ListEcoOrganismsResponse = ApiDataResponse<EcoOrganismDto[]>;
export type DetailEcoOrganismResponse = ApiDataResponse<EcoOrganismDto>;
export type CreateEcoOrganismResponse = ApiDataResponse<EcoOrganismDto>;
export type UpdateEcoOrganismResponse = ApiDataResponse<EcoOrganismDto>;
export type DeleteEcoOrganismResponse = ApiMessageResponse;
export type EcoOrganismStatsResponse = ApiDataResponse<EcoOrganismStatsDto | null>;
export type EcoOrgQuarterStatsResponse = ApiDataResponse<EcoOrgQuarterStatsDto[]>;
