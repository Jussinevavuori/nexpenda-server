import { z } from "zod";

const _scheduleSchema = z
  .object({
    // Interval data
    intervalType: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
    intervalLength: z.number().int().min(1),
    firstOccurrence: z.number().int(),
    occurrences: z
      .number()
      .int()
      .min(1)
      .optional()
      .transform((v) => (v === 0 ? undefined : v)),

    // Template
    integerAmount: z.number().int(),
    category: z.string().nonempty(),
    comment: z.string().optional(),

    // Assign transactions
    assignTransactions: z.array(z.string().nonempty()).optional(),
  })
  .strict();

export const postScheduleSchema = _scheduleSchema;

export const patchScheduleSchema = _scheduleSchema
  .omit({
    comment: true,
    occurrences: true,
  })
  .partial()
  .merge(
    z
      .object({
        comment: z.string().optional().nullable(),
        occurrences: z.number().int().min(0).optional().nullable(),
        updateAllTransactions: z.boolean().optional(),
      })
      .strict()
  )
  .strict();

export const deleteScheduleQuerySchema = z
  .object({
    deleteTransactions: z.string().transform((s) => s === "true"),
  })
  .partial();

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
