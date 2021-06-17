import * as z from "zod";

export const scheduleIntervalSchema = z.union([
  z.object({
    type: z.literal("DAY"),
    every: z.number().positive().int(),
  }),
  z.object({
    type: z.literal("WEEK"),
    every: z.number().positive().int(),
  }),
  z.object({
    type: z.literal("MONTH"),
    every: z.number().positive().int(),
  }),
  z.object({
    type: z.literal("YEAR"),
    every: z.number().positive().int(),
  }),
]);

export type ScheduleInterval = z.TypeOf<typeof scheduleIntervalSchema>;
