import { Transaction } from "@prisma/client";
import { Response } from "express";

function mapTransactionToResponse(transaction: Transaction) {
  return {
    ...transaction,
    time: transaction.time.getTime(),
    comment: transaction.comment ?? undefined,
  };
}

export function respondWithTransactions(
  response: Response,
  transactions: Transaction[]
) {
  response.send(
    transactions
      .map((transaction) => mapTransactionToResponse(transaction))
      .sort((a, b) => a.time - b.time)
  );
}

export function respondWithTransaction(
  response: Response,
  transaction: Transaction
) {
  response.send(mapTransactionToResponse(transaction));
}
