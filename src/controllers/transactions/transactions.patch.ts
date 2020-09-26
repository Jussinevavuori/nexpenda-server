import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { patchTransactionSchema } from "../../schemas/transaction.schema";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { prisma } from "../../server";
import { respondWithTransaction } from "../../utils/respondWithTransactions";
import { Route } from "../../utils/Route";
import { Failure } from "../../utils/Result";

new Route(transactionsRouter, "/:id").protected.patch(
  async (user, req, res) => {
    /**
     * Get ID from request parameters
     */
    const id = req.params.id;

    /**
     * Get transaction for user
     */
    const transaction = await getProtectedTransaction(user, id);

    if (transaction.isFailure()) {
      return transaction;
    }

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, patchTransactionSchema);

    if (body.isFailure()) {
      return body;
    }

    /**
     * Ensure ID is not changed
     */
    if (body.value.id && body.value.id !== transaction.value.id) {
      return Failure.InvalidRequestData({
        id: "Cannot update transaction ID",
      });
    }

    /**
     * Ensure UID is not changed
     */
    if (body.value.uid && body.value.uid !== transaction.value.uid) {
      return Failure.InvalidRequestData({
        uid: "Cannot update transaction owner",
      });
    }

    /**
     * Update transaction
     */
    const updated = await prisma.transaction.update({
      where: { id: transaction.value.id },
      select: {
        id: true,
        uid: true,
        integerAmount: true,
        category: true,
        comment: true,
        time: true,
      },
      data: {
        category: body.value.category,
        comment: body.value.comment,
        time: body.value.time ? new Date(body.value.time) : undefined,
        integerAmount: body.value.integerAmount,
      },
    });

    /**
     * Send updated transaction to user
     */
    respondWithTransaction(res, updated);
  }
);
