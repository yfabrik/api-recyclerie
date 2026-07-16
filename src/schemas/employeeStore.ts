import z from "zod";

import { idSchema } from "../primitives/zod.js";

export const employeeStoreParamsSchema = z.object({
  employeeId: idSchema("employee id requis"),
});

export const assignEmployeeStoreSchema = z.object({
  employee_id: idSchema("employee_id est requis"),
  store_id: idSchema("store_id est requis"),
  is_primary: z.boolean().optional().default(false),
});

export const removeEmployeeStoreParamsSchema = z.object({
  employeeId: idSchema("employee_id est requis"),
  store_id: idSchema().nullish(),
});

export type AssignEmployeeStoreBody = z.infer<typeof assignEmployeeStoreSchema>;
export type AssignEmployeeStoreInput = z.input<typeof assignEmployeeStoreSchema>;
export type RemoveEmployeeStoreParamsInput = z.input<typeof removeEmployeeStoreParamsSchema>;
export type EmployeeStoreParamsInput = z.input<typeof employeeStoreParamsSchema>;