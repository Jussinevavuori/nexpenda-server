import { z } from "zod";

export const patchProfileSchema = z
  .object({
    displayName: z.string().min(1).optional(),
    themeColor: z.string().optional(),
    themeMode: z.string().optional(),
  })
  .strict();

export type PatchProfileSchema = z.TypeOf<typeof patchProfileSchema>;
