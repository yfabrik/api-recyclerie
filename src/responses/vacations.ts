import type { VacationReason } from "../enums/index.js";
import type { IsoDate, IsoDateTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { EmployeeBaseDto } from "./employees.js";

export interface EmployeeVacationBaseDto {
  id: number;
  employee_id: EmployeeBaseDto["id"];
  start_date: IsoDate;
  end_date: IsoDate;
  reason: VacationReason;
  notes: string | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface EmployeeVacationDto extends EmployeeVacationBaseDto {}

export type ListVacationsResponse = ApiDataResponse<EmployeeVacationDto[]>;
export type DetailVacationResponse = ApiDataResponse<EmployeeVacationDto>;
export type CreateVacationResponse = ApiDataResponse<EmployeeVacationDto>;
export type UpdateVacationResponse = ApiDataResponse<EmployeeVacationDto>;
export type DeleteVacationResponse = ApiMessageResponse;
