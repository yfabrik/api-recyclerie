import * as z from "zod";

import { USER_ROLES } from "../enums/index.js";
import { enumSchema, idSchema, phoneSchema } from "../primitives/zod.js";

export const registerSchema = z.object({
  username: z.string("Nom d'utilisateur requis"),
  email: z.email("email requis"),
  password: z.string("password requis"),
  role: enumSchema(USER_ROLES).optional().default("employee"),
  recyclery_id: idSchema().optional(),
});

export const loginSchema = z.object({
  email: z.email("Email et mot de passe requis"),
  password: z.string("Email et mot de passe requis"),
});

export const updateProfileSchema = z.object({
  username: z.string("Nom d'utilisateur requis"),
  email: z.email("email requis"),
  phone: phoneSchema().optional().nullish().prefault(null),
});

export const updatePasswordSchema = z
  .object({
    currentPassword: z.string("mot de passe requis"),
    newPassword: z.string("nouveau mot de passe requis"),
    confirmPassword: z.string("confirmation de mot de passe requis"),
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmPassword) {
      ctx.addIssue({
        code: "custom",
        origin: "newPassword",
        input: data,
        message: "Les mots de passe ne correspondent pas",
      });
    }
  });

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;
export type UpdateProfileInput = z.input<typeof updateProfileSchema>;

export type UpdatePasswordBody = z.infer<typeof updatePasswordSchema>;
