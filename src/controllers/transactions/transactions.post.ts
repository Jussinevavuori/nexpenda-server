import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { postTransactionSchema } from "../../schemas/transaction.schema";
import { prisma } from "../../server";
import { v4 as uuid } from "uuid";
import { respondWithTransaction } from "../../utils/respondWithTransactions";
import { Route } from "../../utils/Route";
import { Failure } from "../../utils/Result";

new Route(transactionsRouter, "/").protected.post(async (user, req, res) => {
  /**
   * Validate request body
   */
  const body = await validateRequestBody(req, postTransactionSchema);

  if (body.isFailure()) {
    return body;
  }

  /**
   * Ensure UID is same as authenticated user's if it exists
   */
  if (body.value.uid && body.value.uid !== user.id) {
    return Failure.InvalidRequestData({
      uid: "Cannot create transaction for another user id",
    });
  }

  /**
   * Generate ID or use provided ID
   */
  const id = body.value.id || uuid();

  /**
   * Check no transaction already exists with given ID
   */
  const existing = await prisma.transaction.findOne({
    where: { id: id },
  });

  if (existing) {
    return Failure.TransactionAlreadyExists();
  }

  /**
   * Create new transaction from body
   */
  const created = await prisma.transaction.create({
    data: {
      id,
      user: { connect: { id: user.id } },
      integerAmount: body.value.integerAmount,
      category: body.value.category,
      comment: body.value.comment,
      time: new Date(body.value.time),
    },
  });

  /**
   * Send created transaction to user
   */
  respondWithTransaction(res.status(201), created);
});
