import type {
  EmailAddress,
  FrenchPhoneNumber,
  IsoDateTime,
} from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { RecycleryRefDto } from "./recycleries.js";
import type { EmployeeWorkdayDto } from "./employeeWorkdays.js";
import type { SkillDto } from "./skills.js";

export interface EmployeeBaseDto {
  id: number;
  nom: string;
  prenom: string;
  isActive: boolean;
  phone: FrenchPhoneNumber | null;
  email: EmailAddress | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface EmployeeDto extends EmployeeBaseDto {
  /** Virtual: `nom` + `prenom`. */
  fullName?: string | undefined;
  /** Virtual: derived from loaded `EmployeeWorkdays`. */
  workTime?: number | undefined;
  stores?: RecycleryRefDto[] | undefined;
  EmployeeWorkdays?: EmployeeWorkdayDto[] | undefined;
  skills?: SkillDto[] | undefined;
}

export type ListEmployeesResponse = ApiDataResponse<EmployeeDto[]>;
export type DetailEmployeeResponse = ApiDataResponse<EmployeeDto>;
export type CreateEmployeeResponse = ApiDataResponse<EmployeeDto>;
export type UpdateEmployeeResponse = ApiDataResponse<EmployeeDto>;
export type DeleteEmployeeResponse = ApiMessageResponse;
export type UpdateEmployeeSkillsResponse = ApiMessageResponse;
