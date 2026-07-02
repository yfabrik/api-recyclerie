import z from "zod";

import { DONATION_STATUSES } from "../enums/index.js";
import { enumSchema, idSchema, phoneSchema } from "../primitives/zod.js";

export const donationDataSchema = z.object({
  donor_name: z.string("nom requis"),
  donor_email: z.email().nullish().prefault(null),
  donor_phone: phoneSchema().nullish().prefault(null),
  item_description: z.string("description requis"),
  estimated_value: z.coerce
    .number()
    .nonnegative("valeur doit etre un nombre valide"),
  weight: z.coerce.number().nonnegative("poids requis"),
  status: enumSchema(DONATION_STATUSES).optional(),
});

export const donationFilterSchema = z.object({
  recyclery_id: idSchema().optional(),
  status: enumSchema(DONATION_STATUSES).optional(),
});

export type DonationData = z.infer<typeof donationDataSchema>;
export type DonationFilter = z.infer<typeof donationFilterSchema>;
