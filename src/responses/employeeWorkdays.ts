import type {
  EmployeeDayOfWeek,
  TimeSlot,
  WorkWeek,
} from "../enums/index.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { EmployeeDto } from "./employees.js";

export interface EmployeeWorkdayDto {
  id: number;
  employee_id: EmployeeDto["id"];
  day_of_week: EmployeeDayOfWeek;
  time_slot: TimeSlot;
  is_working: boolean;
  start_time: string;
  end_time: string;
  notes?: string | null;
  week: WorkWeek;
  createdAt: string;
  updatedAt: string;
}

export type ListEmployeeWorkdaysResponse = ApiDataResponse<EmployeeWorkdayDto[]>;
export type CreateEmployeeWorkdaysResponse = ApiMessageResponse;
