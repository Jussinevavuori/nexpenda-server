import * as z from "zod";

export const patchProfileSchema = z.object({
  displayName: z.string().min(1).optional(),
  photoUrl: z.string().optional(),
  prefersColorScheme: z.string().optional(),
});

export type PatchProfileSchema = z.TypeOf<typeof patchProfileSchema>;
