import { Category, Transaction, TransactionSchedule } from "@prisma/client";
import { unique } from "../utils/unique";

export type TransactionResponseMappable = Transaction & {
  Category: Category;
  Schedule?: TransactionSchedule | null;
};

export type TransactionResponse = {
  id: string;
  time: number;
  createdAt: number;
  integerAmount: number;
  comment?: string | undefined;
  category: {
    id: string;
    value: string;
    icon: string;
  };
  scheduleId?: string;
};

export type CompressedDataJson = {
  t: {
    // Transactions
    id: string; // ID
    t: number; // Time (epoch, seconds)
    ca: number; // Time (epoch, seconds)
    cid: string; // Category ID
    sid?: string; // Schedule ID
    a: number; // Amount
    c?: string | undefined; // Comment
  }[];
  c: {
    // Categories
    id: string; // ID
    v: string; // Value
    i: string; // Icon
  }[];
};

/**
 * The transaction mapper is used to map single or multiple transactions into a
 * transaction response that can be sent to the caller in the response. The
 * mapper can also compress the data into the `CompressedDataJson` format for
 * lower bandwidth usage.
 */
export class TransactionMapper {
  // Singular function override
  static mapTransactionsToResponse(
    transaction: TransactionResponseMappable
  ): TransactionResponse;

  // Array function override
  static mapTransactionsToResponse(
    transaction: TransactionResponseMappable[]
  ): TransactionResponse[];

  /**
   * Maps a single or multiple transactions to a format which is then sent to
   * the user.
   *
   * @param transaction Single transaction or an array of transactions.
   */
  static mapTransactionsToResponse(
    transaction: TransactionResponseMappable | TransactionResponseMappable[]
  ): TransactionResponse | TransactionResponse[] {
    if (Array.isArray(transaction)) {
      return transaction.map((t) =>
        TransactionMapper.mapTransactionsToResponse(t)
      );
    } else {
      return {
        id: transaction.id,
        time: transaction.time.getTime(),
        integerAmount: transaction.integerAmount,
        comment: transaction.comment ?? undefined,
        createdAt: transaction.createdAt.getTime(),
        scheduleId: transaction.Schedule?.id,
        category: {
          id: transaction.Category.id,
          value: transaction.Category.value,
          icon: transaction.Category.icon || "",
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
    transactions: Array<
      Transaction & {
        Category: Category;
        Schedule?: TransactionSchedule | null;
      }
    >
  ): CompressedDataJson {
    // Get all unique categories (unique defined by ID)
    const categories = unique(
      transactions.map((t) => t.Category),
      (a, b) => a.id === b.id
    );

    // Return transactions in compressed format
    return {
      t: transactions.map((t) => ({
        id: t.id,
        cid: t.categoryId,
        sid: t.scheduleId ?? undefined,
        a: t.integerAmount,
        t: Math.floor(t.time.getTime() / 1000),
        ca: Math.floor(t.createdAt.getTime() / 1000),
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
