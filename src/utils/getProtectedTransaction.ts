import { InvalidRequestDataError } from "../errors/InvalidRequestDataError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { User } from "@prisma/client";
import { prisma } from "../server";

/**
 * Helper function to fetch a transaction for user. Only allows accessing
 * own resources
 *
 * @param user Requesting user
 * @param id   Id of requested transaction
 *
 * @throws UnauthorizedError if attempting to access foreign resource
 */
export async function getProtectedTransaction(user: User, id?: string) {
  if (!id) {
    throw new InvalidRequestDataError("No ID provided as URL parameter");
  }

  const transaction = await prisma.transaction.findOne({ where: { id } });

  if (transaction && transaction.uid !== user.id) {
    throw new UnauthorizedError("Cannot access another user's transaction");
  }

  return transaction;
}
