import { z } from "zod";

export const configSchema = z
  .object({
    freeTransactionsLimit: z.number().int().positive(),
    freeBudgetsLimit: z.number().int().positive(),
    status: z.enum(["online", "offline"]),
  })
  .strict();

export const patchConfigSchema = configSchema.partial();

// Type extractions
export type ConfigSchema = z.TypeOf<typeof configSchema>;
export type PatchConfigSchema = z.TypeOf<typeof patchConfigSchema>;
