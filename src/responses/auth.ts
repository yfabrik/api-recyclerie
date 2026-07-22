import type {
  PermissionAction,
  PermissionModule,
} from "../enums/index.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { UserBaseDto } from "./users.js";

export type AuthUserDto = Pick<
  UserBaseDto,
  "id" | "username" | "email" | "role" | "phone"
>;

export interface AuthSessionDto {
  token: string;
  user: AuthUserDto;
}

export interface UserProfileDto {
  user: AuthUserDto;
  permissions: (PermissionAction | "*")[];
  permissionsByModule: Partial<
    Record<PermissionModule, PermissionAction[]>
  >;
}

export type RegisterResponse = ApiDataResponse<AuthSessionDto>;
export type LoginResponse = ApiDataResponse<AuthSessionDto>;
export type UserProfileResponse = ApiDataResponse<UserProfileDto>;
export type UpdateProfileResponse = ApiDataResponse<AuthUserDto>;
export type UpdatePasswordResponse = ApiMessageResponse;
