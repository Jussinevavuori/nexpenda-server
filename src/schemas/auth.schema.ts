import * as z from "zod";

export const emailOnlyAuthSchema = z.object({
  email: z.string().email().max(255),
});

export const passwordOnlyAuthSchema = z.object({
  password: z.string().min(6).max(255),
});

export const authSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(6).max(255),
});

export type EmailOnlyAuthSchema = z.TypeOf<typeof emailOnlyAuthSchema>;

export type PasswordOnlyAuthSchema = z.TypeOf<typeof passwordOnlyAuthSchema>;

export type AuthSchema = z.TypeOf<typeof authSchema>;
