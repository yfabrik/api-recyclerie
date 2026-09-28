import type { TaskCategory, TaskPriority, Weekday } from "../enums/index.js";
import type { IsoDateTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CollectionPointBaseDto } from "./collectionPoints.js";
import type { RecycleryBaseDto, RecycleryRefDto } from "./recycleries.js";
import type { TaskScheduleBaseDto } from "./taskSchedule.js";
import type { EmployeeDto } from "./employees.js";
import type { TimeRangeDto } from "./timeRanges.js";

export interface TaskBaseDto {
  id: number;
  name: string;
  description: string | null;
  category: TaskCategory;
  priority: TaskPriority | null;
  required_skills: string | null;
  location: string | null;
  equipment_needed: string | null;
  hourly_rate: number | null;
  scheduled_date: IsoDateTime;
  start_time: IsoDateTime;
  end_time: IsoDateTime;
  notes: string | null;
  status: string | null;
  schedule_id: TaskScheduleBaseDto["id"] | null;
  store_id: RecycleryBaseDto["id"] | null;
  collection_point_id: CollectionPointBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface TaskDto extends TaskBaseDto {
  /** Virtual: derived from `scheduled_date`. */
  day_of_week: Weekday | null;
  Recyclery?: RecycleryRefDto | null | undefined;
  Employees?: EmployeeDto[] | undefined;
}

/** An assigned Employee as returned by `GET /api/tasks/:id/employees`, with its ranges on that Task. */
export interface TaskAssignedEmployeeDto extends EmployeeDto {
  timeRanges: TimeRangeDto[];
}

export type ListTasksResponse = ApiDataResponse<TaskDto[]>;
export type DetailTaskResponse = ApiDataResponse<TaskDto>;
export type CreateTaskResponse = ApiDataResponse<TaskDto>;
export type UpdateTaskResponse = ApiDataResponse<TaskDto>;
export type DeleteTaskResponse = ApiMessageResponse;
export type TaskEmployeesResponse = ApiDataResponse<TaskAssignedEmployeeDto[]>;
export type RemoveEmployeeTaskResponse = ApiMessageResponse;
