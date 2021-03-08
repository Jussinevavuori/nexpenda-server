import { object, string, InferType } from "yup";

export const patchProfileSchema = object({
  displayName: string().min(1),
  photoUrl: string(),
  prefersColorScheme: string(),
}).required();

export type PatchProfileSchema = InferType<typeof patchProfileSchema>;
