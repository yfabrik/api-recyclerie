import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { RecycleryRefDto } from "./recycleries.js";
import type { EmployeeDto } from "./employees.js";

export interface EmployeeStoreAssignmentDto extends RecycleryRefDto {
  is_primary?: boolean;
}

export interface EmployeeWithStoreAssignmentsDto extends EmployeeDto {
  stores?: EmployeeStoreAssignmentDto[];
}

export type ListEmployeeStoreResponse = ApiDataResponse<EmployeeWithStoreAssignmentsDto[]>;
export type EmployeeStoreByEmployeeResponse = ApiDataResponse<EmployeeStoreAssignmentDto[]>;
export type ListStoreEmployeesResponse = ApiDataResponse<EmployeeDto[]>;
export type AssignEmployeeStoreResponse = ApiDataResponse<EmployeeWithStoreAssignmentsDto>;
export type RemoveEmployeeStoreResponse = ApiMessageResponse;
