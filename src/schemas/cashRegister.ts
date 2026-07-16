import * as z from "zod";

import { idSchema } from "../primitives/zod.js";

export const cashRegisterFilterSchema = z.object({
  is_active: z.coerce.boolean().optional(),
  store_id: idSchema().optional(),
});

export const cashRegisterCreateSchema = z.object({
  name: z.string("Nom obligatoire").trim().min(1, "Nom obligatoire"),
  store_id: z.coerce.number("magasin obligatoire"),
  is_active: z.coerce.boolean().optional().default(true),
});

export const cashRegisterUpdateSchema = z.object({
  name: z.string("Nom obligatoire").trim().min(1, "Nom obligatoire"),
  is_active: z.coerce.boolean().optional().default(true),
});

export type CashRegisterFilter = z.infer<typeof cashRegisterFilterSchema>;
export type CashRegisterCreate = z.infer<typeof cashRegisterCreateSchema>;
export type CashRegisterUpdate = z.infer<typeof cashRegisterUpdateSchema>;
export type CashRegisterFilterInput = z.input<typeof cashRegisterFilterSchema>;
export type CashRegisterCreateInput = z.input<typeof cashRegisterCreateSchema>;
export type CashRegisterUpdateInput = z.input<typeof cashRegisterUpdateSchema>;
