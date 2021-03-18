import * as z from "zod";

export const TimestampMsString = z
  .string()
  .regex(/^\d{13}$/)
  .refine((s) => Boolean(new Date(Number(s)).getTime()));
