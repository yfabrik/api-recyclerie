import z from "zod";
import type { ZodTypeAny } from "zod/v3";
import {
  ALPHANUMERIC_REGEX,
  FRENCH_PHONE_REGEX,
  FRENCH_POSTAL_CODE_REGEX,
} from "./patterns.js";

export const nullishToNull = (schema: ZodTypeAny) =>
  schema.nullish().transform((val) => val ?? null);

export const phoneSchema = (message?: string) =>
  z
    .string({ message })
    .regex(FRENCH_PHONE_REGEX, { message })
    .brand("FrenchPhoneNumber");

export const postalSchema = (message?: string) =>
  z
    .string({ message })
    .regex(FRENCH_POSTAL_CODE_REGEX, { message })
    .brand("FrenchPostalCode");

export const alphanumericSchema = (message?: string) =>
  z
    .string({ message })
    .regex(ALPHANUMERIC_REGEX, { message })
    .brand("AlphanumericString");

export const emailSchema = (message?: string) =>
  z.email({ message }).brand("EmailAddress");

export const urlSchema = (message?: string) =>
  z.url({ message }).brand("Url");

export const idSchema = (message?: string) =>
  z.coerce.number({ message }).positive({ message });

export const enumSchema = <const T extends readonly [string, ...string[]]>(
  values: T,
  message?: string,
) => (message ? z.enum(values, message) : z.enum(values));

export type FrenchPhoneNumber = z.infer<ReturnType<typeof phoneSchema>>;
export type FrenchPostalCode = z.infer<ReturnType<typeof postalSchema>>;
export type AlphanumericString = z.infer<ReturnType<typeof alphanumericSchema>>;
export type EmailAddress = z.infer<ReturnType<typeof emailSchema>>;
export type Url = z.infer<ReturnType<typeof urlSchema>>;
