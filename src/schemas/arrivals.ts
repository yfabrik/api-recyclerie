import * as z from "zod";

import {
  ARRIVAL_SOURCE_TYPES,
  ARRIVAL_STATUSES,
} from "../enums/index.js";
import { enumSchema, idSchema } from "../primitives/zod.js";

export const arrivalDataSchema = z
  .object({
    category_id: idSchema("catégorie requis"),
    subcategory_id: idSchema().nullish().prefault(null),
    weight: z.coerce.number().positive("poids requis"),
    arrival_date: z.coerce.date("date d'arrivage requis"),
    arrival_time: z.coerce.date(" date d'arrivage requis").transform((val) =>
      val.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      }),
    ),
    source_type: enumSchema(ARRIVAL_SOURCE_TYPES, "type de source requis"),
    source_details: z.string().nullish().prefault(null),
    collection_point_id: idSchema().nullish().prefault(null),
    collection_point_name: z.string().nullish().prefault(null),
    collection_point_address: z.string().nullish().prefault(null),
    notes: z.string().nullish().prefault(null),
  })
  .superRefine((obj, ctx) => {
    if (obj.source_type == "point" && !obj.collection_point_id)
      ctx.addIssue({
        code: "custom",
        origin: "collection_point_id",
        message: "si source = point,collection point requis",
        input: obj,
      });
  });

export const arrivalFilterSchema = z.object({
  category_id: idSchema().optional(),
  source_type: enumSchema(ARRIVAL_SOURCE_TYPES).optional(),
  status: enumSchema(ARRIVAL_STATUSES).optional(),
  date_from: z.coerce.date().optional(),
  date_to: z.coerce.date().optional(),
  collection_point_id: idSchema().optional(),
});

export const arrivalDateFilterSchema = z.object({
  date_from: z.coerce.date().optional(),
  date_to: z.coerce.date().optional(),
});

export type ArrivalData = z.infer<typeof arrivalDataSchema>;
export type ArrivalFilter = z.infer<typeof arrivalFilterSchema>;

export type ArrivalFilterInput = z.input<typeof arrivalFilterSchema>;
export type arrivalDataInput = z.input<typeof arrivalDataSchema>;