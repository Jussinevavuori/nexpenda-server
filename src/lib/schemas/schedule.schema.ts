import { z } from "zod";

const _intervalSchema = z
  .object({
    type: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
    every: z.number().positive().int(),
  })
  .strict();

const _scheduleSchema = z
  .object({
    firstOccurrence: z
      .number()
      .positive()
      .int()
      .refine((n) => !Number.isNaN(new Date(n).getTime())),
    occurrences: z.number().min(0).int().optional(),
    interval: _intervalSchema,
  })
  .strict();

const _transactionTemplateSchema = z
  .object({
    integerAmount: z.number().int(),
    category: z.string().nonempty(),
    comment: z.string().optional(),
    categoryIcon: z.string().optional(),
  })
  .strict();

export const postScheduleSchema = z
  .object({
    schedule: _scheduleSchema,
    transactionTemplate: _transactionTemplateSchema,
    assignTransactions: z.array(z.string().nonempty()).optional(),
  })
  .strict();

export const patchScheduleSchema = z
  .object({
    schedule: _scheduleSchema
      .extend({
        occurrences: _scheduleSchema.shape.occurrences.nullable(),
      })
      .partial(),
    transactionTemplate: _transactionTemplateSchema
      .extend({
        comment: _transactionTemplateSchema.shape.comment.nullable(),
      })
      .partial(),
    assignTransactions: z.array(z.string().nonempty()).optional(),
    updateAllTransactions: z.boolean().optional(),
  })
  .partial()
  .strict();

export const deleteScheduleQuerySchema = z
  .object({
    deleteTransactions: z.string().transform((s) => s === "true"),
  })
  .partial();

export const scheduleIntervalSchema = z
  .object({
    type: z.enum(["DAY", "WEEK", "MONTH", "YEAR"]),
    every: z.number().positive().int(),
  })
  .strict();

export type ScheduleInterval = z.TypeOf<typeof scheduleIntervalSchema>;
