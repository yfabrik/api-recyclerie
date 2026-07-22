import z from "zod";
import type { ZodTypeAny } from "zod/v3";
import {
  ALPHANUMERIC_REGEX,
  FRENCH_PHONE_REGEX,
  FRENCH_POSTAL_CODE_REGEX,
  ITEM_BARCODE_REGEX,
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

/** 12-digit zero-padded labeled-item barcode (virtual from id). */
export const barcodeSchema = (message?: string) =>
  z
    .string({ message })
    .regex(ITEM_BARCODE_REGEX, {
      message: message ?? "code-barres 12 chiffres requis",
    })
    .brand("ItemBarcode");

export const enumSchema = <const T extends readonly [string, ...string[]]>(
  values: T,
  message?: string,
) => (message ? z.enum(values, message) : z.enum(values));

/** UTC ISO 8601 datetime string (e.g. 2026-07-18T10:00:00.000Z). */
export const isoDateTimeSchema = (message?: string) =>
  z.iso.datetime({ message }).brand("IsoDateTime");

/** Calendar date YYYY-MM-DD. */
export const isoDateSchema = (message?: string) =>
  z.iso.date({ message }).brand("IsoDate");

export const isoTimeSchema = (message?: string) =>
  z.iso
    .time({ message })
    .transform((val) => val.slice(0, 5))
    .pipe(z.iso.time({ precision: -1, message }).brand("IsoTime"));

/** JS weekday 0=Sunday … 6=Saturday. */
export const weekdaySchema = (message?: string) =>
  z.coerce
    .number({ message })
    .int({ message })
    .min(0, { message: message ?? "jour 0–6 requis" })
    .max(6, { message: message ?? "jour 0–6 requis" })
    .transform((n) => n as 0 | 1 | 2 | 3 | 4 | 5 | 6);

export type FrenchPhoneNumber = z.infer<ReturnType<typeof phoneSchema>>;
export type FrenchPostalCode = z.infer<ReturnType<typeof postalSchema>>;
export type AlphanumericString = z.infer<ReturnType<typeof alphanumericSchema>>;
export type EmailAddress = z.infer<ReturnType<typeof emailSchema>>;
export type Url = z.infer<ReturnType<typeof urlSchema>>;
export type ItemBarcode = z.infer<ReturnType<typeof barcodeSchema>>;
export type IsoDateTime = z.infer<ReturnType<typeof isoDateTimeSchema>>;
export type IsoDate = z.infer<ReturnType<typeof isoDateSchema>>;
export type IsoTime = z.infer<ReturnType<typeof isoTimeSchema>>;
