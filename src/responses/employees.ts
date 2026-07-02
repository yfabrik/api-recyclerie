import type {
  EmailAddress,
  FrenchPhoneNumber,
} from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { RecycleryRefDto } from "./recycleries.js";
import type { EmployeeWorkdayDto } from "./employeeWorkdays.js";
import type { SkillDto } from "./skills.js";

export interface EmployeeDto {
  id: number;
  nom: string;
  prenom: string;
  isActive: boolean;
  phone?: FrenchPhoneNumber | null;
  email?: EmailAddress | null;
  fullName?: string;
  workTime?: number;
  createdAt: string;
  updatedAt: string;
  stores?: RecycleryRefDto[];
  EmployeeWorkdays?: EmployeeWorkdayDto[];
  skills?: SkillDto[];
}

export type ListEmployeesResponse = ApiDataResponse<EmployeeDto[]>;
export type DetailEmployeeResponse = ApiDataResponse<EmployeeDto>;
export type CreateEmployeeResponse = ApiDataResponse<EmployeeDto>;
export type UpdateEmployeeResponse = ApiDataResponse<EmployeeDto>;
export type DeleteEmployeeResponse = ApiMessageResponse;
export type UpdateEmployeeSkillsResponse = ApiMessageResponse;
