import type { DonationStatus } from "../enums/index.js";
import type {
  AlphanumericString,
  EmailAddress,
  FrenchPhoneNumber,
} from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { RecycleryDto } from "./recycleries.js";
import type { UserDto, UserRefDto } from "./users.js";

export type { UserRefDto } from "./users.js";

export interface DonationDto {
  id: number;
  donor_name: AlphanumericString | null;
  donor_phone: FrenchPhoneNumber | null;
  donor_email: EmailAddress | null;
  item_description: string | null;
  estimated_value: number | null;
  status: DonationStatus;
  weight: number;
  recyclery_id?: RecycleryDto["id"] | null;//TODO required ?
  received_by?: UserDto["id"] | null;
  received_at?: string;
  createdAt: string;
  updatedAt: string;
  User?: UserRefDto | null;
}

export interface DonationStatsDto {
  total_donations?: number | string;
  pending_donations?: number | string | null;
  accepted_donations?: number | string | null;
  rejected_donations?: number | string | null;
  total_estimated_value?: number | string | null;
}

export type ListDonationsResponse = ApiDataResponse<DonationDto[]>;
export type CreateDonationResponse = ApiDataResponse<DonationDto>;
export type UpdateDonationResponse = ApiMessageResponse;
export type DeleteDonationResponse = ApiMessageResponse;
export type DonationStatsResponse = ApiDataResponse<DonationStatsDto | null>;
