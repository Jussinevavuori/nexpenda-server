import * as z from "zod";

export const putAvatarSchema = z.object({
  url: z.string().nonempty().url(),
});

export type PutAvatarSchema = z.TypeOf<typeof putAvatarSchema>;
