import type { IsoDateTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
} from "../types/response.js";

export interface SkillBaseDto {
  id: number;
  name: string;
  isActive: boolean;
  description: string | null;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface SkillDto extends SkillBaseDto {}

export type ListSkillsResponse = ApiDataResponse<SkillDto[]>;
export type CreateSkillResponse = ApiDataResponse<SkillDto>;
