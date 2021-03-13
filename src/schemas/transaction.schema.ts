import * as z from "zod";

export const transactionSchema = z.object({
  id: z.string().optional(),
  uid: z.string().optional(),
  time: z.number().positive().int(),
  category: z.string().nonempty(),
  integerAmount: z.number().int(),
  comment: z.string().optional(),
  categoryIcon: z.string().optional(),
});

export const postTransactionSchema = transactionSchema;
export const putTransactionSchema = transactionSchema;
export const patchTransactionSchema = transactionSchema
  .partial()
  .omit({ comment: true })
  .merge(
    z.object({
      comment: z.string().optional().nullable(),
    })
  );

export const deleteTransactionsSchema = z.object({
  ids: z.array(z.string()),
});

export const postTransactionsSchema = z.object({
  transactions: z.array(postTransactionSchema),
});

export type TransactionSchema = z.TypeOf<typeof transactionSchema>;
export type PostTransactionSchema = z.TypeOf<typeof postTransactionSchema>;
export type PutTransactionSchema = z.TypeOf<typeof putTransactionSchema>;
export type PatchTransactionSchema = z.TypeOf<typeof patchTransactionSchema>;
export type PostTransactionsSchema = z.TypeOf<typeof postTransactionsSchema>;
export type DeleteTransactionsSchema = z.TypeOf<
  typeof deleteTransactionsSchema
>;
