import { Transaction } from "@prisma/client";
import { prisma } from "../server";
import { Result, Failure, Success } from "./Result";

/**
 * Helper function to fetch a transaction for user.
 *
 * @param id   Id of requested transaction
 */
export async function getUnprotectedTransaction(
  id?: string
): Promise<Result<Transaction>> {
  /**
   * Ensure ID exists
   */
  if (!id) {
    return Failure.InvalidRequestData({
      id: "No ID provided as URL parameter",
    });
  }

  /**
   * Get transaction
   */
  const transaction = await prisma.transaction.findOne({ where: { id } });

  /**
   * Ensure transaction exists and is user's
   */
  if (!transaction) {
    return Failure.TransactionNotFound();
  }

  /**
   * Return transaction as success
   */
  return new Success(transaction);
}
