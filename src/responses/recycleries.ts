import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type {
  EmailAddress,
  FrenchPhoneNumber,
  FrenchPostalCode,
  IsoDateTime,
} from "../primitives/zod.js";
import type { UserBaseDto, UserRefDto } from "./users.js";
import type { CashRegisterDto, CashRegisterRefDto } from "./cashRegister.js";
import type { EmployeeDto } from "./employees.js";
import type { TaskScheduleDto } from "./taskSchedule.js";

export interface RecycleryBaseDto {
  id: number;
  name: string;
  address: string | null;
  phone: FrenchPhoneNumber | null;
  email: EmailAddress | null;
  city: string | null;
  postal_code: FrenchPostalCode | null;
  is_active: boolean;
  manager_id: UserBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface RecycleryDto extends RecycleryBaseDto {
  /** List-query aggregate (`COUNT` of cash registers). */
  cash_registers_count?: number | undefined;
  manager?: UserRefDto | null | undefined;
  /** Nested registers are refs only; use cash-register list for aggregates. */
  caisses?: CashRegisterRefDto[] | undefined;
  employees?: EmployeeDto[] | undefined;
  TaskSchedules?: TaskScheduleDto[] | undefined;
}

export type RecycleryRefDto = Pick<
  RecycleryBaseDto,
  "id" | "name" | "city" | "is_active"
>;

export interface RecycleryStatsDto {
  available_items?: number | null | undefined;
  sold_items?: number | null | undefined;
  reserved_items?: number | null | undefined;
  total_items?: number | null | undefined;
  monthly_sales: number;
  monthly_revenue: number;
}

export type ListRecycleriesResponse = ApiDataResponse<RecycleryDto[]>;
export type DetailRecycleryResponse = ApiDataResponse<RecycleryDto>;
export type CreateRecycleryResponse = ApiDataResponse<RecycleryDto>;
export type UpdateRecycleryResponse = ApiDataResponse<RecycleryDto>;
export type DeleteRecycleryResponse = ApiMessageResponse;
export type ListRecycleryCashRegistersResponse = ApiDataResponse<CashRegisterDto[]>;
export type RecycleryStatsResponse = ApiDataResponse<RecycleryStatsDto>;
