import type {
  ApiDataResponse,
  ApiMessageResponse,
} from "../types/response.js";
import type { CashSessionDto } from "./cashSession.js";
import type { RecycleryDto, RecycleryRefDto } from "./recycleries.js";

export interface CashRegisterDto {
  id: number;
  name: string;
  is_active: boolean;
  recyclery_id: RecycleryDto["id"];
  createdAt: string;
  updatedAt: string;
  store_name?: string | null;//TODO il a reelement le type ?
  total_sessions?: number | string;
  last_session?: string | null;//TODO last session id or last session date ?
  Recyclery?: RecycleryRefDto | null;
  sessions?: CashSessionRefDto[];
}

export type CashRegisterRefDto = Pick<
  CashRegisterDto,
  "id" | "name" | "is_active" | "recyclery_id"
>;

/** Cash register ref with store, used when nested under a cash session. */
export interface CashRegisterSessionRefDto extends CashRegisterRefDto {
  Recyclery?: RecycleryRefDto | null;
}
//TODO move to cashSession.ts ?
export type CashSessionRefDto = Pick<
  CashSessionDto,
  | "id"
  | "opening_amount"
  | "closing_amount"
  | "expected_amount"
  | "status"
  | "notes"
  | "closed_at"
  | "cash_register_id"
  | "user_id"
  | "createdAt"
  | "updatedAt"
>;

export type ListCashRegistersResponse = ApiDataResponse<CashRegisterDto[]>;
export type DetailCashRegisterResponse = ApiDataResponse<CashRegisterDto>;
export type CreateCashRegisterResponse = ApiDataResponse<CashRegisterDto>;
export type UpdateCashRegisterResponse = ApiDataResponse<CashRegisterDto>;
export type DeleteCashRegisterResponse = ApiMessageResponse;
