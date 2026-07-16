import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type {
  EmailAddress,
  FrenchPhoneNumber,
  FrenchPostalCode,
} from "../primitives/zod.js";
import type { UserDto, UserRefDto } from "./users.js";
import type { CashRegisterDto } from "./cashRegister.js";
import type { EmployeeDto } from "./employees.js";
import type { TaskScheduleDto } from "./taskSchedule.js";

export interface RecycleryDto {
  id: number;
  name: string;
  address?: string | null;
  phone?: FrenchPhoneNumber | null;
  email?: EmailAddress | null;
  city?: string | null;
  postal_code?: FrenchPostalCode | null;
  is_active: boolean;
  manager_id?: UserDto["id"] | null;
  cash_registers_count?: number | string;//TODO where can i find it ? is it really string ?
  createdAt: string;
  updatedAt: string;
  manager?: UserRefDto | null;
  caisses?: CashRegisterDto[];
  employees?: EmployeeDto[];
  TaskSchedules?: TaskScheduleDto[];
}

export type RecycleryRefDto = Pick<
  RecycleryDto,
  "id" | "name" | "city" | "is_active"
>;

export interface RecycleryStatsDto {
  available_items?: number | string | null;
  sold_items?: number | string | null;
  reserved_items?: number | string | null;
  total_items?: number | string | null;
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
