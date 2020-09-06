import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { putTransactionSchema } from "../../schemas/transaction.schema";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { prisma } from "../../server";
import { respondWithTransaction } from "../../utils/respondWithTransactions";
import { Route } from "../../utils/Route";
import { Errors } from "../../errors/Errors";
import { Failure } from "../../utils/Result";
import { getUnprotectedTransaction } from "../../utils/getUnprotectedTransaction";

new Route(transactionsRouter, "/:id").protected.put(async (user, req, res) => {
  /**
   * Get ID from request parameters
   */
  const id = req.params.id;

  /**
   * Validate request body
   */
  const body = await validateRequestBody(req, putTransactionSchema);

  if (body.isFailure()) {
    return body;
  }

  /**
   * Get transaction for user
   */
  const transaction = await getProtectedTransaction(user, id);
  const doesNotExist = await (await getUnprotectedTransaction(id)).isFailure();

  /**
   * Validate when creating new resource
   */
  if (transaction.isFailure() && doesNotExist) {
    /**
     * Ensure UID is same as authenticated user's if it exists
     */
    if (body.value.uid && body.value.uid !== user.id) {
      return new Failure(
        Errors.Data.InvalidRequestData({
          uid: "Cannot create transaction for another user id",
        })
      );
    }
  }

  /**
   * Validate when updating resource
   */
  if (transaction.isSuccess()) {
    /**
     * Ensure ID is not changed
     */
    if (body.value.id && body.value.id !== transaction.value.id) {
      return new Failure(
        Errors.Data.InvalidRequestData({
          id: "Cannot update transaction ID",
        })
      );
    }

    /**
     * Ensure UID is not changed
     */
    if (body.value.uid && body.value.uid !== transaction.value.uid) {
      return new Failure(
        Errors.Data.InvalidRequestData({
          uid: "Cannot update transaction owner",
        })
      );
    }
  }

  /**
   * Upsert transaction
   */
  const upserted = await prisma.transaction.upsert({
    where: { id },
    create: {
      id,
      user: { connect: { id: user.id } },
      integerAmount: body.value.integerAmount,
      category: body.value.category,
      comment: body.value.comment,
      time: new Date(body.value.time),
    },
    update: {
      integerAmount: body.value.integerAmount,
      category: body.value.category,
      time: new Date(body.value.time),
      comment: body.value.comment === undefined ? null : body.value.comment,
    },
  });

  /**
   * Send upserted transaction to user
   */
  respondWithTransaction(res, upserted);
});
