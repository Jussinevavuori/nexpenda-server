import { z } from "zod";

export const putAvatarSchema = z
  .object({
    url: z.string().nonempty().url(),
  })
  .strict();

// Type extractions
export type PutAvatarSchema = z.TypeOf<typeof putAvatarSchema>;
