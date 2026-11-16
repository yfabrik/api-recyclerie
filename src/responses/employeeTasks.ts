import type { IsoDate } from "../primitives/zod.js";
import type { ApiDataResponse } from "../types/response.js";
import type { EmployeeBaseDto } from "./employees.js";
import type { TaskDto } from "./tasks.js";
import type { TimeRangeDto, WorkWindowDto } from "./timeRanges.js";
import type { EmployeeVacationDto } from "./vacations.js";

/**
 * How one Task stands for the Employee that day:
 * - `assigned`: the Employee has at least one Time range on it;
 * - `assignable`: not assigned, and at least one window is free;
 * - `unavailable`: not assigned and no free window, see `reason`.
 */
export type EmployeeTaskStatus = "assigned" | "assignable" | "unavailable";

/**
 * Why an unassigned Task cannot take the Employee:
 * - `outside-hours`: no Workday hours overlap the Task;
 * - `busy`: the Workday hours overlap it but the Employee's Time ranges on another Task cover them (`blockedBy`);
 * - `vacation`: the Employee is on Vacation that day (first and last day included). Every Task they do not
 *   hold gets it, whatever their hours; Tasks they still hold stay `assigned` (a Vacation conflict).
 */
export type EmployeeTaskUnavailableReason = "outside-hours" | "busy" | "vacation";

export interface EmployeeTaskRowDto {
  task: TaskDto;
  status: EmployeeTaskStatus;
  /** The Employee's Time ranges on this Task, earliest first. Non-empty if and only if `status` is `assigned`. */
  timeRanges: TimeRangeDto[];
  /**
   * Where a new Time range could land, from the Employee's Workday hours and their Time ranges on
   * OTHER Tasks that day: exactly what `assignableWindows` gives from the available-employees data
   * of the same Task. An assigned row's own ranges are not subtracted (the front does that per range).
   * Empty when `status` is `unavailable`.
   */
  freeWindows: WorkWindowDto[];
  /** Only when `status` is `unavailable`. */
  reason?: EmployeeTaskUnavailableReason | undefined;
  /** Only when `reason` is `busy`: the Task that holds the Employee's blocking Time range. */
  blockedBy?: TaskDto | undefined;
}

/** One calendar day of the requested range. */
export interface EmployeeTasksDayDto {
  date: IsoDate;
  /** The Employee's Workday hours that day (weekday and bi-week), earliest first; empty when they do not work. */
  workWindows: WorkWindowDto[];
  /** The Vacation covering that day (first and last day included), or `null`. */
  vacation: EmployeeVacationDto | null;
  /** Assigned, assignable and unavailable Tasks of the day, ordered by start time then end time then id. */
  rows: EmployeeTaskRowDto[];
}

export interface EmployeeTasksDto {
  employee_id: EmployeeBaseDto["id"];
  /** One entry per date from `date_from` to `date_to`, both included, in order, even when `rows` is empty. */
  days: EmployeeTasksDayDto[];
}

/** `GET /api/employees/:id/tasks?date_from&date_to` */
export type EmployeeTasksResponse = ApiDataResponse<EmployeeTasksDto>;
