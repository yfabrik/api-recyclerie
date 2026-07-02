import type {
  ApiDataResponse,
} from "../types/response.js";

export interface SkillDto {
  id: number;
  name: string;
  isActive: boolean;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ListSkillsResponse = ApiDataResponse<SkillDto[]>;
export type CreateSkillResponse = ApiDataResponse<SkillDto>;
