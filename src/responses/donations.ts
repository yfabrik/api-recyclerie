import type { DonationStatus } from "../enums/index.js";
import type {
  AlphanumericString,
  EmailAddress,
  FrenchPhoneNumber,
  IsoDateTime,
} from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { RecycleryBaseDto } from "./recycleries.js";
import type { UserBaseDto, UserRefDto } from "./users.js";

export type { UserRefDto } from "./users.js";

export interface DonationBaseDto {
  id: number;
  donor_name: AlphanumericString | null;
  donor_phone: FrenchPhoneNumber | null;
  donor_email: EmailAddress | null;
  item_description: string | null;
  estimated_value: number | null;
  status: DonationStatus;
  weight: number;
  recyclery_id: RecycleryBaseDto["id"] | null;
  received_by: UserBaseDto["id"];
  received_at: IsoDateTime;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface DonationDto extends DonationBaseDto {
  User?: UserRefDto | null | undefined;
}

export interface DonationStatsDto {
  total_donations?: number | undefined;
  pending_donations?: number | null | undefined;
  accepted_donations?: number | null | undefined;
  rejected_donations?: number | null | undefined;
  total_estimated_value?: number | null | undefined;
}

export type ListDonationsResponse = ApiDataResponse<DonationDto[]>;
export type CreateDonationResponse = ApiDataResponse<DonationDto>;
export type UpdateDonationResponse = ApiMessageResponse;
export type DeleteDonationResponse = ApiMessageResponse;
export type DonationStatsResponse = ApiDataResponse<DonationStatsDto | null>;
