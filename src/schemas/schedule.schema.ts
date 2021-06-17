import { z } from "zod";

export const scheduleIntervalSchema = z.union([
  z
    .object({
      type: z.literal("DAY"),
      every: z.number().positive().int(),
    })
    .strict(),
  z
    .object({
      type: z.literal("WEEK"),
      every: z.number().positive().int(),
    })
    .strict(),
  z
    .object({
      type: z.literal("MONTH"),
      every: z.number().positive().int(),
    })
    .strict(),
  z
    .object({
      type: z.literal("YEAR"),
      every: z.number().positive().int(),
    })
    .strict(),
]);

export type ScheduleInterval = z.TypeOf<typeof scheduleIntervalSchema>;
