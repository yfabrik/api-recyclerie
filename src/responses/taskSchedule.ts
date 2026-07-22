import type {
  RecurrencePattern,
  TaskCategory,
  TaskPriority,
  Weekday,
} from "../enums/index.js";
import type { IsoDateTime, IsoTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CollectionPointBaseDto } from "./collectionPoints.js";
import type { RecycleryBaseDto, RecycleryRefDto } from "./recycleries.js";
import type { TaskDto } from "./tasks.js";
import type { EmployeeDto } from "./employees.js";

export interface TaskScheduleBaseDto {
  id: number;
  name: string;
  description: string | null;
  category: TaskCategory;
  priority: TaskPriority | null;
  required_skills: string | null;
  location: string | null;
  equipment_needed: string | null;
  hourly_rate: number | null;
  is_recurring: boolean;
  recurrence_pattern: RecurrencePattern | null;
  scheduled_date: IsoDateTime;
  start_time: IsoDateTime;
  end_time: IsoDateTime;
  notes: string | null;
  status: string | null;
  store_id: RecycleryBaseDto["id"] | null;
  collection_point_id: CollectionPointBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface TaskScheduleDto extends TaskScheduleBaseDto {
  /** Virtual: derived from `scheduled_date`. */
  day_of_week: Weekday | null;
  Tasks?: TaskDto[] | undefined;
  Recyclery?: RecycleryRefDto | null | undefined;
  Employees?: EmployeeDto[] | undefined;
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

/** Projection of vente TaskSchedule rows for store opening hours (not a table model). */
export interface StoreHoursDto {
  id: number;
  name: string | null;
  day_of_week: Weekday | null;
  is_open: boolean;
  open_time: IsoTime;
  close_time: IsoTime;
  is_24h: boolean;
  notes: string | null;
  store_id: RecycleryBaseDto["id"] | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface PlanningStatsOverviewDto {
  total_schedules?: number | undefined;
  scheduled_count?: number | null | undefined;
  in_progress_count?: number | null | undefined;
  completed_count?: number | null | undefined;
  cancelled_count?: number | null | undefined;
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
