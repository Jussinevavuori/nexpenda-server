import { z } from "zod";

export const TimestampMsString = z
  .string()
  .regex(/^\d{13}$/)
  .refine((s) => !Number.isNaN(new Date(parseInt(s)).valueOf()));

export const TimestampMsStringAsDate = TimestampMsString.transform(
  (string) => new Date(parseInt(string))
);
