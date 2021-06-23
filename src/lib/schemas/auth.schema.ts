import { z } from "zod";

/**
 * Utilities
 */
const Field = {
  email: () => z.string().email().max(255),
  password: () => z.string().min(6).max(255),
};

export const idAuthSchema = z
  .object({
    id: z.string().nonempty(),
  })
  .strict();

export const emailOnlyAuthSchema = z
  .object({
    email: Field.email(),
  })
  .strict();

export const passwordOnlyAuthSchema = z
  .object({
    password: Field.password(),
  })
  .strict();

export const fullAuthSchema = z
  .object({
    email: Field.email(),
    password: Field.password(),
  })
  .strict();

// Type extractions
export type IdAuthSchema = z.TypeOf<typeof idAuthSchema>;
export type EmailOnlyAuthSchema = z.TypeOf<typeof emailOnlyAuthSchema>;
export type PasswordOnlyAuthSchema = z.TypeOf<typeof passwordOnlyAuthSchema>;
export type FullAuthSchema = z.TypeOf<typeof fullAuthSchema>;
