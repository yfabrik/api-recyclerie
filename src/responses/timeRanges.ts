import type { IsoDateTime, IsoTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { EmployeeBaseDto, EmployeeDto } from "./employees.js";
import type { TaskBaseDto } from "./tasks.js";

/** A stretch of a Task covered by an Employee. Times are `HH:MM`, the Task's own day. */
export interface TimeRangeDto {
  id: number;
  employee_id: EmployeeBaseDto["id"];
  task_id: TaskBaseDto["id"];
  start_time: IsoTime;
  end_time: IsoTime;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

/** One stretch of an Employee's Workday hours. */
export interface WorkWindowDto {
  start_time: IsoTime;
  end_time: IsoTime;
}

/** Employee offered for a Task: Store, Workday and Vacation filtering is already applied. */
export interface TaskAvailableEmployeeDto extends EmployeeDto {
  /** Workday hours for the Task's day and week. */
  workWindows: WorkWindowDto[];
  /** The Employee's Time ranges on other Tasks that day. */
  busyRanges: TimeRangeDto[];
}

export type TaskAvailableEmployeesResponse = ApiDataResponse<TaskAvailableEmployeeDto[]>;
/** `POST /api/tasks/:id/employees`: the range created, whether given or picked by the server. */
export type AssignEmployeeTaskRangeResponse = ApiDataResponse<TimeRangeDto>;
export type CreateTimeRangeResponse = ApiDataResponse<TimeRangeDto>;
export type UpdateTimeRangeResponse = ApiDataResponse<TimeRangeDto>;
export type DeleteTimeRangeResponse = ApiMessageResponse;
