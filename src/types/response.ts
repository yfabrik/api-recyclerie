import type { PaginationMeta } from "./pagination.js";

export interface ApiErrorDetail {
  path: string;
  message: string;
}

export type ApiErrorOptions = {
  error?: string;
  details?: ApiErrorDetail[];
  status?: number;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
} & ApiErrorOptions;

/** Success envelope: `{ success: true, message?, ...payload }` */
export type ApiSuccessBody<TPayload extends Record<string, unknown> = Record<string, never>> = {
  success: true;
  message?: string;
} & TPayload;

/** Standard single-resource payload: `{ success: true, data, message? }` */
export type ApiDataResponse<TData> = ApiSuccessBody<{ data: TData }>;

/** Standard list + pagination: `{ success: true, data, pagination, message? }` */
export type ApiPaginatedResponse<TItem> = ApiSuccessBody<{
  data: TItem[];
  pagination: PaginationMeta;
}>;

/** Message-only success: `{ success: true, message }` */
export type ApiMessageResponse = ApiSuccessBody<{ message: string }>;

export type ApiResponseOptions = {
  message?: string;
};

/** Build `{ success: true, ...payload }` with an optional message. */
export const apiSuccess = <const TPayload extends Record<string, unknown>>(
  payload: TPayload,
  options?: ApiResponseOptions,
): ApiSuccessBody<TPayload> => ({
  success: true,
  ...payload,
  ...(options?.message !== undefined && { message: options.message }),
});

/** Build `{ success: true, data, message? }`. */
export const apiData = <TData>(
  data: TData,
  options?: ApiResponseOptions,
): ApiDataResponse<TData> => apiSuccess({ data }, options);

/** Build `{ success: true, data: items, pagination, message? }`. */
export const apiPaginated = <TItem>(
  items: TItem[],
  pagination: PaginationMeta,
  options?: ApiResponseOptions,
): ApiPaginatedResponse<TItem> =>
  apiSuccess({ data: items, pagination }, options);

/** Build `{ success: true, message }`. */
export const apiMessage = (message: string): ApiMessageResponse =>
  apiSuccess({ message });

/** Build `{ success: true, message, ...payload }` with a required message. */
export const apiResult = <TPayload extends Record<string, unknown>>(
  payload: TPayload,
  message: string,
): ApiMessageResponse & TPayload => ({
  success: true,
  message,
  ...payload,
});

/** Alias for `apiData` — use for 201 Created responses. */
export const apiCreated = apiData;

/** Build `{ success: false, message, ... }`. */
export const apiError = (
  message: string,
  options?: ApiErrorOptions,
): ApiErrorResponse => ({
  success: false,
  message,
  ...options,
});
