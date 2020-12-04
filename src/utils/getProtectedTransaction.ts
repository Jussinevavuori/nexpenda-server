import { User, Transaction } from "@prisma/client";
import { prisma } from "../server";
import {
  InvalidRequestDataFailure,
  TransactionNotFoundFailure,
} from "./Failures";
import { Result, Success } from "./Result";

/**
 * Helper function to fetch a transaction for user. Only allows accessing
 * own resources
 *
 * @param user Requesting user
 * @param id   Id of requested transaction
 */
export async function getProtectedTransaction(user: User, id?: string) {
  /**
   * Ensure ID exists
   *
   *
   */
  if (!id) {
    return new InvalidRequestDataFailure<Transaction>({
      id: "No ID provided as URL parameter",
    });
  }

  /**
   * Get transaction
   */
  const transaction = await prisma.transaction.findUnique({ where: { id } });

  /**
   * Ensure transaction exists and is user's
   */
  if (!transaction || transaction.uid !== user.id) {
    return new TransactionNotFoundFailure<Transaction>();
  }

  /**
   * Return transaction as success
   */
  return new Success(transaction);
}
