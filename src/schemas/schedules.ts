import { idSchema, isoTimeSchema, weekdaySchema } from "../primitives/zod.js";
import z from "zod";

export const createCollectionPointPresenceDataSchema = z.object({
  collection_point_id: idSchema(
    "ID du point de collecte et jour de la semaine sont obligatoires",
  ),
  store_id: idSchema().nullish().prefault(null),
  day_of_week: weekdaySchema("jour de la semaine requis"),
  is_open: z.coerce.boolean().default(true),
  start_time: isoTimeSchema("heure de début requise"),
  end_time: isoTimeSchema("heure de fin requise"),
  is_24h: z.coerce.boolean().default(false),
  notes: z.string().nullish().prefault(null),
  is_present: z.coerce.boolean().default(true),
});

export const createStoreHoursDataSchema = z.object({
  store_id: idSchema("ID du magasin et jour de la semaine sont obligatoires"),
  day_of_week: weekdaySchema("jour de la semaine requis"),
  is_recurring: z.coerce.boolean().default(true),
  start_time: isoTimeSchema("heure de début requise"),
  end_time: isoTimeSchema("heure de fin requise"),
  is_24h: z.coerce.boolean().default(false),
  notes: z.string().nullish(),
});

export type CreateCollectionPointPresenceData = z.infer<
  typeof createCollectionPointPresenceDataSchema
>;
export type CreateStoreHoursData = z.infer<typeof createStoreHoursDataSchema>;
export type CreateCollectionPointPresenceDataInput = z.input<
  typeof createCollectionPointPresenceDataSchema
>;
export type CreateStoreHoursDataInput = z.input<typeof createStoreHoursDataSchema>;
