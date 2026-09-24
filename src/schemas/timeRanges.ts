import z from "zod";

import { isoTimeSchema } from "../primitives/zod.js";

/**
 * Body of `POST|PUT /api/tasks/:id/employees/:employeeId/time-ranges`.
 * Only the shape is checked here; the rules (length, grid, Task, Workday,
 * overlap) belong to `validateTimeRange` so the server answers them with a 409.
 */
export const timeRangeBodySchema = z.object({
  start_time: isoTimeSchema("heure de début requise"),
  end_time: isoTimeSchema("heure de fin requise"),
});

export type TimeRangeBody = z.infer<typeof timeRangeBodySchema>;
export type TimeRangeBodyInput = z.input<typeof timeRangeBodySchema>;
