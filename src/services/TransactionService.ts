import { Category, Transaction } from "@prisma/client";
import { DataUtils } from "../utils/DataUtils";

export type TransactionResponseMappable = Transaction & { category: Category };

export type TransactionResponse = {
  id: string;
  time: number;
  integerAmount: number;
  comment?: string | undefined;
  category: {
    id: string;
    value: string;
    icon: string;
  };
};

export type CompressedDataJson = {
  t: {
    id: string; // ID
    t: number; // Time (epoch)
    cid: string; // Category ID
    a: number; // Amount
    c?: string | undefined; // Comment
  }[];
  c: {
    id: string; // ID
    v: string; // Value
    i: string; // Icon
  }[];
};

export class TransactionService {
  // Singular function override
  static mapTransactionToResponse(
    transaction: TransactionResponseMappable
  ): TransactionResponse;

  // Array function override
  static mapTransactionToResponse(
    transaction: TransactionResponseMappable[]
  ): TransactionResponse[];

  /**
   * Maps a single or multiple transactions to a format which is then sent to
   * the user.
   *
   * @param transaction Single transaction or an array of transactions.
   */
  static mapTransactionToResponse(
    transaction: TransactionResponseMappable | TransactionResponseMappable[]
  ): TransactionResponse | TransactionResponse[] {
    if (Array.isArray(transaction)) {
      return transaction.map((t) =>
        TransactionService.mapTransactionToResponse(t)
      );
    } else {
      return {
        id: transaction.id,
        time: transaction.time.getTime(),
        integerAmount: transaction.integerAmount,
        comment: transaction.comment ?? undefined,
        category: {
          id: transaction.category.id,
          value: transaction.category.value,
          icon: transaction.category.icon || "",
        },
      };
    }
  }

  /**
   * Compresses transactions to smaller JSON format for smaller response body
   * sizes.
   *
   * @param transactions Transactions to compress
   */
  static compressTransactions(
    transactions: Array<Transaction & { category: Category }>
  ): CompressedDataJson {
    // Get all unique categories (unique defined by ID)
    const categories = DataUtils.unique(
      transactions.map((t) => t.category),
      (a, b) => a.id === b.id
    );

    // Return transactions in compressed format
    return {
      t: transactions.map((t) => ({
        id: t.id,
        cid: t.categoryId,
        a: t.integerAmount,
        t: t.time.getTime(),
        c: t.comment ?? undefined,
      })),
      c: categories.map((c) => ({
        id: c.id,
        v: c.value,
        i: c.icon || "",
      })),
    };
  }
}
