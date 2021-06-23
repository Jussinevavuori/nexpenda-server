import { z } from "zod";
import { TimestampMsStringAsDate } from "./utils.schema";

export const transactionSchema = z
  .object({
    id: z.string().optional(),
    uid: z.string().optional(),
    time: z.number().positive().int(),
    category: z.string().nonempty(),
    integerAmount: z.number().int(),
    comment: z.string().optional(),
    categoryIcon: z.string().optional(),
  })
  .strict();

export const postTransactionSchema = transactionSchema.omit({
  uid: true,
  id: true,
});

export const putTransactionSchema = transactionSchema.omit({
  uid: true,
  id: true,
});

export const patchTransactionSchema = transactionSchema
  .partial()
  .omit({
    comment: true,
    uid: true,
    id: true,
  })
  .merge(z.object({ comment: z.string().optional().nullable() }).strict());

export const deleteManyTransactionsSchema = z
  .object({
    ids: z.array(z.string()),
  })
  .strict();

export const postManyTransactionsSchema = z
  .object({
    transactions: z.array(postTransactionSchema),
  })
  .strict();

export const getTransactionsQuerySchema = z
  .object({
    after: TimestampMsStringAsDate,
    before: TimestampMsStringAsDate,
    scheduleId: z.string(),
  })
  .partial();

// Type extractions
export type TransactionSchema = z.TypeOf<typeof transactionSchema>;
export type PostTransactionSchema = z.TypeOf<typeof postTransactionSchema>;
export type PutTransactionSchema = z.TypeOf<typeof putTransactionSchema>;
export type PatchTransactionSchema = z.TypeOf<typeof patchTransactionSchema>;
export type PostTransactionsSchema = z.TypeOf<
  typeof postManyTransactionsSchema
>;
export type DeleteTransactionsSchema = z.TypeOf<
  typeof deleteManyTransactionsSchema
>;
export type GetTransactionQuerySchema = z.TypeOf<
  typeof getTransactionsQuerySchema
>;
