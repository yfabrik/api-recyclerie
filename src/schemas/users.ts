import * as z from "zod";

import { USER_ROLES } from "../enums/index.js";
import { enumSchema, idSchema, phoneSchema } from "../primitives/zod.js";

const ALLOWED_INCLUDES = ["managedStores"] as const;

export const userListFilterSchema = z.object({
  store_id: z.coerce.number().optional(),
  role: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : []))
    .pipe(z.array(enumSchema(USER_ROLES))),
  active: z.coerce.boolean().optional(),
  include: z
    .string()
    .optional()
    .transform((val) => (val ? val.split(",") : []))
    .pipe(z.array(z.enum(ALLOWED_INCLUDES))),
});

export const userCreateSchema = z.object({
  username: z.string("Nom d'utilisateur obligatoire").trim().nonempty(),
  email: z.email(" email obligatoire"),
  password: z.string(" mot de passe  obligatoire"),
  role: enumSchema(USER_ROLES).optional().default("employee"),
  managedStores: z.array(idSchema()).nullish(),
  phone: phoneSchema().nullish().prefault(null),
  isActive: z.coerce.boolean().optional().prefault(true),
});

export const userUpdateSchema = z.object({
  username: z.string("Nom d'utilisateur obligatoire").trim().nonempty(),
  email: z.email(" email obligatoire"),
  role: enumSchema(USER_ROLES).optional().default("employee"),
  managedStores: z.array(idSchema()).nullish(),
  phone: phoneSchema().nullish().prefault(null),
  isActive: z.coerce.boolean().optional().default(true),
});

export const userAdminUpdatePasswordSchema = z.object({
  newPassword: z
    .string("nouveau mot de passe requis")
    .min(6, "mot de passe tros court"),
});

export type UserListFilter = z.infer<typeof userListFilterSchema>;
export type UserCreateBody = z.infer<typeof userCreateSchema>;
export type UserUpdateBody = z.infer<typeof userUpdateSchema>;
