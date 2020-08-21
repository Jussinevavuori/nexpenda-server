import { Transaction } from "@prisma/client";
import { Response } from "express";

export function respondWithTransactions(
  response: Response,
  transactions: Transaction[]
) {
  response.send(
    transactions
      .map((transaction) => ({
        ...transaction,
        time: transaction.time.getTime(),
      }))
      .sort((a, b) => a.time - b.time)
  );
}

export function respondWithTransaction(
  response: Response,
  transaction: Transaction
) {
  response.send({
    ...transaction,
    time: transaction.time.getTime(),
  });
}
