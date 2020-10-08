import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { patchTransactionSchema } from "../../schemas/transaction.schema";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { prisma } from "../../server";
import { mapTransactionToResponse } from "../../utils/mapTransactionToResponse";
import {
  InvalidRequestDataFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

transactionsRouter.patch("/:id", async (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }

  /**
   * Get ID from request parameters
   */
  const id = req.params.id;

  /**
   * Get transaction for user
   */
  const transaction = await getProtectedTransaction(req.data.auth.user, id);

  if (transaction.isFailure()) {
    return next(transaction);
  }

  /**
   * Validate request body
   */
  const body = await validateRequestBody(req, patchTransactionSchema);

  if (body.isFailure()) {
    return next(body);
  }

  /**
   * Ensure ID is not changed
   */
  if (body.value.id && body.value.id !== transaction.value.id) {
    return next(
      new InvalidRequestDataFailure({
        id: "Cannot update transaction ID",
      })
    );
  }

  /**
   * Ensure UID is not changed
   */
  if (body.value.uid && body.value.uid !== transaction.value.uid) {
    return next(
      new InvalidRequestDataFailure({
        uid: "Cannot update transaction owner",
      })
    );
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
  return res.json(mapTransactionToResponse(updated));
});
