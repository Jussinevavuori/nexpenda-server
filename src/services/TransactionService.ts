import { Category, Transaction } from "@prisma/client";
import { prisma } from "../server";
import { DataUtils } from "../utils/DataUtils";
import { TransactionLimitExceededFailure } from "../utils/Failures";
import { Success } from "../utils/Result";
import { ConfigurationService } from "./ConfigurationService";
import { StripeService } from "./StripeService";

export type TransactionResponseMappable = Transaction & { Category: Category };

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
};

export type CompressedDataJson = {
  t: {
    id: string; // ID
    t: number; // Time (epoch, seconds)
    ca: number; // Time (epoch, seconds)
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
        createdAt: transaction.createdAt.getTime(),
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
    transactions: Array<Transaction & { Category: Category }>
  ): CompressedDataJson {
    // Get all unique categories (unique defined by ID)
    const categories = DataUtils.unique(
      transactions.map((t) => t.Category),
      (a, b) => a.id === b.id
    );

    // Return transactions in compressed format
    return {
      t: transactions.map((t) => ({
        id: t.id,
        cid: t.categoryId,
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

  /**
   * Ensure the user is allowed to create transactions. The user is allowed to
   * create unlimited transactions as a premium member, else they have a limit.
   * If this limit is exceeded by creating the given amount of transactions,
   * return a failure.
   *
   * @param user				The user
   * @param createCount	The number of transactions that are being created.
   * 										Defaults to one.
   */
  static async ensureCreatePermission(
    user: RequestUser,
    createCount: number = 1
  ) {
    // Premium users are always permitted
    const isPremium = await StripeService.isPremium(user.stripeCustomerId);
    if (isPremium) {
      return Success.Empty();
    }

    // Fetch current configuration
    const configuration = await ConfigurationService.getConfiguration();
    const limit = configuration.isSuccess()
      ? configuration.value.freeTransactionsLimit
      : Infinity; // No limit when configuration fails

    // Count user's current transactions
    const currentCount = await prisma.transaction.count({
      where: { uid: user.id },
    });

    // If too many transactions, return failure
    if (currentCount + createCount > limit) {
      return new TransactionLimitExceededFailure();
    }

    return Success.Empty();
  }
}
