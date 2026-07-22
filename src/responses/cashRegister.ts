import type { IsoDateTime } from "../primitives/zod.js";
import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CashSessionRefDto } from "./cashSession.js";
import type { RecycleryBaseDto, RecycleryRefDto } from "./recycleries.js";

export interface CashRegisterBaseDto {
  id: number;
  name: string;
  is_active: boolean;
  recyclery_id: RecycleryBaseDto["id"];
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
}

export interface CashRegisterDto extends CashRegisterBaseDto {
  /** From Recyclery join / association (controller query). */
  store_name: string | null;
  /** Aggregate `COUNT(sessions)` (controller query). */
  total_sessions?: number | undefined;
  /** Aggregate `MAX(sessions.createdAt)` (controller query). */
  last_session: IsoDateTime | null;
  Recyclery?: RecycleryRefDto | null | undefined;
  sessions?: CashSessionRefDto[] | undefined;
}

export type CashRegisterRefDto = Pick<
  CashRegisterBaseDto,
  "id" | "name" | "is_active" | "recyclery_id"
>;

/** Cash register ref with store, used when nested under a cash session. */
export interface CashRegisterSessionRefDto extends CashRegisterRefDto {
  Recyclery?: RecycleryRefDto | null | undefined;
}


export type ListCashRegistersResponse = ApiDataResponse<CashRegisterDto[]>;
export type DetailCashRegisterResponse = ApiDataResponse<CashRegisterDto>;
export type CreateCashRegisterResponse = ApiDataResponse<CashRegisterDto>;
export type UpdateCashRegisterResponse = ApiDataResponse<CashRegisterDto>;
export type DeleteCashRegisterResponse = ApiMessageResponse;
