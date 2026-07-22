import z from "zod";

import { WASTE_DISPOSAL_TYPES } from "../enums/index.js";
import { enumSchema, idSchema, isoDateSchema } from "../primitives/zod.js";

export const wasteBodySchema = z
  .object({
    disposal_date: z.coerce.date("date de sortie requis"),
    category_id: idSchema("categorie requis"),
    subcategory_id: idSchema().nullish().prefault(null),
    eco_organism_id: idSchema().nullish().prefault(null),
    disposal_type: enumSchema(WASTE_DISPOSAL_TYPES, "type de sortie requis"),
    weight_kg: z.coerce.number().positive("poid requis"),
    volume_m3: z.coerce.number().nonnegative().nullish().prefault(null),
    transport_method: z.string().nullish().prefault(null),
    transport_company: z.string().nullish().prefault(null),
    transport_cost: z.coerce.number().nonnegative().nullish().prefault(null),
    notes: z.string().nullish().prefault(null),
  })
  .superRefine((obj, ctx) => {
    if (obj.disposal_type === "eco_organism" && !obj.eco_organism_id)
      ctx.addIssue({
        code: "custom",
        origin: "disposal_type",
        message: "Éco-organisme requis pour ce type de sortie",
        input: obj,
      });
  });

export const listWasteQuerySchema = z.object({
  category_id: idSchema().nullish(),
  subcategory_id: idSchema().nullish(),
  eco_organism_id: idSchema().nullish(),
  disposal_type: enumSchema(WASTE_DISPOSAL_TYPES).nullish(),
  date_from: isoDateSchema().optional(),
  date_to: isoDateSchema().optional(),
});

export const wasteDateRangeQuerySchema = z.object({
  date_from: isoDateSchema().optional(),
  date_to: isoDateSchema().optional(),
});

export const wasteIdParamsSchema = z.object({
  id: idSchema(),
});

export type WasteBody = z.infer<typeof wasteBodySchema>;
export type ListWasteQuery = z.infer<typeof listWasteQuerySchema>;
export type WasteDateRangeQuery = z.infer<typeof wasteDateRangeQuerySchema>;
export type WasteIdParams = z.infer<typeof wasteIdParamsSchema>;
export type WasteBodyInput = z.input<typeof wasteBodySchema>;
export type ListWasteQueryInput = z.input<typeof listWasteQuerySchema>;
export type WasteDateRangeQueryInput = z.input<typeof wasteDateRangeQuerySchema>;
export type WasteIdParamsInput = z.input<typeof wasteIdParamsSchema>;