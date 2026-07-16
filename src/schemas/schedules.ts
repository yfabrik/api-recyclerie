import type { FrenchWeekday } from "../enums/index.js";
import { enumSchema, idSchema } from "../primitives/zod.js";
import z from "zod";
import { FRENCH_WEEKDAYS } from "../enums/index.js";

const timeToDate = (val: string) => {
  const [hours, min] = val.split(":") as [string, string, ...string[]];
  return new Date(new Date().setHours(+hours, +min));
};

export const createCollectionPointPresenceDataSchema = (
  getDateFromDay: (day: FrenchWeekday) => Date,
) =>
  z.object({
    collection_point_id: idSchema(
      "ID du point de collecte et jour de la semaine sont obligatoires",
    ),
    store_id: idSchema().nullish().prefault(null),
    day_of_week: enumSchema(FRENCH_WEEKDAYS).transform((val) =>
      getDateFromDay(val),
    ),
    is_open: z.coerce.boolean().default(true),
    start_time: z.union([z.iso.time().transform(timeToDate), z.coerce.date()]),
    end_time: z.union([z.iso.time().transform(timeToDate), z.coerce.date()]),
    is_24h: z.coerce.boolean().default(false),
    notes: z.string().nullish().prefault(null),
    is_present: z.coerce.boolean().default(true),
  });

export const createStoreHoursDataSchema = (
  getDateFromDay: (day: FrenchWeekday) => Date,
) =>
  z.object({
    store_id: idSchema("ID du magasin et jour de la semaine sont obligatoires"),
    day_of_week: enumSchema(FRENCH_WEEKDAYS).transform((val) =>
      getDateFromDay(val),
    ),
    is_recurring: z.coerce.boolean().default(true),
    start_time: z.union([
      z.iso.time().transform((val) => {
        const [hours, min] = val.split(":");
        return new Date().setHours(+(hours ?? 0), +(min ?? 0));
      }),
      z.coerce.date(),
    ]),
    end_time: z.union([
      z.iso.time().transform((val) => {
        const [hours, min] = val.split(":");
        return new Date().setHours(+(hours ?? 0), +(min ?? 0));
      }),
      z.coerce.date(),
    ]),
    is_24h: z.coerce.boolean().default(false),
    notes: z.string().nullish(),
  });

export type CreateCollectionPointPresenceDataInput = z.input<ReturnType<typeof createCollectionPointPresenceDataSchema>>;
export type CreateStoreHoursDataInput = z.input<ReturnType<typeof createStoreHoursDataSchema>>;