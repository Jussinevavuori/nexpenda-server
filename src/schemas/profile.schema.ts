import * as z from "zod";

export const patchProfileSchema = z.object({
  displayName: z.string().min(1).optional(),
  photoUrl: z.string().optional(),
  themeColor: z.string().optional(),
  themeMode: z.string().optional(),
});

export type PatchProfileSchema = z.TypeOf<typeof patchProfileSchema>;
