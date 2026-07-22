import type { TimeSlot, Weekday, WorkWeek } from "../enums/index.js";
import type { IsoDateTime, IsoTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { EmployeeBaseDto } from "./employees.js";

export interface EmployeeWorkdayBaseDto {
  id: number;
  employee_id: EmployeeBaseDto["id"];
  day_of_week: Weekday;
  time_slot: TimeSlot;
  is_working: boolean;
  start_time: IsoTime;
  end_time: IsoTime;
  notes: string | null;
  week: WorkWeek;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface EmployeeWorkdayDto extends EmployeeWorkdayBaseDto {}

export type ListEmployeeWorkdaysResponse = ApiDataResponse<EmployeeWorkdayDto[]>;
export type CreateEmployeeWorkdaysResponse = ApiMessageResponse;
