import { z } from "zod";

export const createCheckoutSessionBodySchema = z
  .object({
    priceId: z.string().nonempty(),
  })
  .strict();
