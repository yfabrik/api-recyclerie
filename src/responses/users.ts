import type { UserRole } from "../enums/index.js";
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

export interface UserBaseDto {
  id: number;
  username: string;
  email: EmailAddress;
  role: UserRole;
  phone: FrenchPhoneNumber | null;
  isActive: boolean;
  last_login: IsoDateTime | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface UserDto extends UserBaseDto {
  managedStores?: RecycleryRefDto[] | undefined;
}

export type UserRefDto = Pick<
  UserBaseDto,
  "id" | "username" | "email" | "role"
>;

export interface UserStatsByRoleDto {
  role: UserRole | string;
  count: number;
}

export interface UserStatsDto {
  totalUsers: number;
  usersByRole: UserStatsByRoleDto[];
  recentLogins: number;
  activeEmployees: number;
}

export type ListUsersResponse = ApiDataResponse<UserDto[]>;
export type DetailUserResponse = ApiDataResponse<UserDto>;
export type CreateUserResponse = ApiDataResponse<UserDto>;
export type UpdateUserResponse = ApiDataResponse<UserDto>;
export type DeleteUserResponse = ApiMessageResponse;
export type UserStatsResponse = ApiDataResponse<UserStatsDto>;
export type UpdateUserPasswordResponse = ApiMessageResponse;
