import type { TaskCategory, TaskPriority } from "../enums/index.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CollectionPointDto } from "./collectionPoints.js";
import type { RecycleryDto, RecycleryRefDto } from "./recycleries.js";
import type { TaskScheduleDto } from "./taskSchedule.js";
import type { EmployeeDto } from "./employees.js";

export interface  TaskDto {
  id: number;
  name: string;
  description?: string | null;
  category: TaskCategory;
  priority?: TaskPriority | null;
  required_skills?: string | null;
  location?: string | null;
  equipment_needed?: string | null;
  hourly_rate?: number | string | null;
  scheduled_date: string;
  start_time: string;
  end_time: string;
  notes?: string | null;
  status: string | null;
  schedule_id?: TaskScheduleDto["id"] | null;
  store_id?: RecycleryDto["id"] | null;
  collection_point_id?: CollectionPointDto["id"] | null;
  day_of_week?: string | null;
  createdAt: string;
  updatedAt: string;
  Recyclery?: RecycleryRefDto | null;
  Employees?: EmployeeDto[];
}

export type ListTasksResponse = ApiDataResponse<TaskDto[]>;
export type DetailTaskResponse = ApiDataResponse<TaskDto>;
export type CreateTaskResponse = ApiDataResponse<TaskDto>;
export type UpdateTaskResponse = ApiDataResponse<TaskDto>;
export type DeleteTaskResponse = ApiMessageResponse;
export type TaskEmployeesResponse = ApiDataResponse<EmployeeDto[]>;
export type AssignEmployeeTaskResponse = ApiMessageResponse;
export type RemoveEmployeeTaskResponse = ApiMessageResponse;
