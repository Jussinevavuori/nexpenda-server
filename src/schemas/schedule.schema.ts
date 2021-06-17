import * as z from "zod";

export const scheduleIntervalSchema = z.union([
  z.object({
    type: z.literal("day"),
    every: z.number().positive().int(),
  }),
  z.object({
    type: z.literal("week"),
    every: z.number().positive().int(),
  }),
  z.object({
    type: z.literal("month"),
    every: z.number().positive().int(),
  }),
  z.object({
    type: z.literal("year"),
    every: z.number().positive().int(),
  }),
]);

export type ScheduleInterval = z.TypeOf<typeof scheduleIntervalSchema>;
