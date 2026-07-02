import type {
  RecurrencePattern,
  TaskCategory,
  TaskPriority,
} from "../enums/index.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CollectionPointDto } from "./collectionPoints.js";
import type { RecycleryDto, RecycleryRefDto } from "./recycleries.js";
import type { TaskDto } from "./tasks.js";
import type { EmployeeDto } from "./employees.js";

export interface TaskScheduleDto {
  id: number;
  name: string;
  description?: string | null;
  category: TaskCategory;
  priority?: TaskPriority | null;
  required_skills?: string | null;
  location?: string | null;
  equipment_needed?: string | null;
  hourly_rate?: number | string | null;
  is_recurring: boolean;
  recurrence_pattern?: RecurrencePattern | null;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  notes?: string | null;
  status: string | null;
  store_id?: RecycleryDto["id"] | null;
  collection_point_id?: CollectionPointDto["id"] | null;
  day_of_week?: string | null;
  createdAt: string;
  updatedAt: string;
  Tasks?: TaskDto[];
  Recyclery?: RecycleryRefDto | null;
  Employees?: EmployeeDto[];
}

export type TaskScheduleRefDto = Pick<
  TaskScheduleDto,
  | "id"
  | "name"
  | "is_recurring"
  | "category"
  | "scheduled_date"
  | "start_time"
  | "end_time"
  | "day_of_week"
  | "recurrence_pattern"
  | "collection_point_id"
  | "store_id"
>;

export interface StoreHoursDto {
  id: number;
  name?: string;
  day_of_week?: string | null;
  is_open: boolean;
  open_time: string;
  close_time: string;
  is_24h: boolean;
  notes?: string | null;
  store_id?: RecycleryDto["id"] | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlanningStatsOverviewDto {
  total_schedules?: number | string;
  scheduled_count?: number | string | null;
  in_progress_count?: number | string | null;
  completed_count?: number | string | null;
  cancelled_count?: number | string | null;
}

export interface PlanningStatsDto {
  overview: PlanningStatsOverviewDto | null;
  topTasks: unknown[];
  topEmployees: unknown[];
}

export interface AvailableEmployeeDto extends EmployeeDto {
  is_available: boolean;
  has_conflicts: boolean;
  conflicts: TaskDto[];
  already_assigned: boolean;
}

export type ListTaskSchedulesResponse = ApiDataResponse<TaskScheduleDto[]>;
export type DetailTaskScheduleResponse = ApiDataResponse<TaskScheduleDto>;
export type CreateTaskScheduleResponse = ApiDataResponse<TaskScheduleDto>;
export type UpdateTaskScheduleResponse = ApiMessageResponse;
export type DeleteTaskScheduleResponse = ApiMessageResponse;
export type EmployeeScheduleResponse = ApiDataResponse<TaskScheduleDto[]>;
export type AssignEmployeeScheduleResponse = ApiDataResponse<TaskDto>;
export type AvailableEmployeesResponse = ApiDataResponse<AvailableEmployeeDto[]>;
export type PlanningStatsResponse = ApiDataResponse<PlanningStatsDto>;

export type ListStoreHoursResponse = ApiDataResponse<StoreHoursDto[]>;
export type CreateStoreHoursResponse = ApiDataResponse<{ id: number }>;
export type UpdateStoreHoursResponse = ApiDataResponse<TaskScheduleDto>;

export type CreateCollectionPointPresenceResponse = ApiDataResponse<TaskScheduleDto>;
