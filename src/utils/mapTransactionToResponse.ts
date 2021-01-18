import { Transaction } from "@prisma/client";

export type TransactionMappable = Transaction;

export type TransactionResponse = Omit<Transaction, "time" | "comment"> & {
  time: number;
  comment: string | undefined;
};

export function mapTransactionToResponse(
  transaction: TransactionMappable
): TransactionResponse;

export function mapTransactionToResponse(
  transaction: TransactionMappable[]
): TransactionResponse[];

export function mapTransactionToResponse(
  transaction: TransactionMappable | TransactionMappable[]
): TransactionResponse | TransactionResponse[] {
  if (Array.isArray(transaction)) {
    return transaction
      .map((t) => mapTransactionToResponse(t))
      .sort((a, b) => a.time - b.time);
  } else {
    return {
      ...transaction,
      time: transaction.time.getTime(),
      comment: transaction.comment ?? undefined,
    };
  }
}
