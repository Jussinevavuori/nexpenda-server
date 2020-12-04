import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { postTransactionSchema } from "../../schemas/transaction.schema";
import { prisma } from "../../server";
import { v4 as uuid } from "uuid";
import { mapTransactionToResponse } from "../../utils/mapTransactionToResponse";
import {
  InvalidRequestDataFailure,
  TransactionAlreadyExistsFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

transactionsRouter.post("/", async (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }

  /**
   * Validate request body
   */
  const body = await validateRequestBody(req, postTransactionSchema);

  if (body.isFailure()) {
    return next(body);
  }

  /**
   * Ensure UID is same as authenticated user's if it exists
   */
  if (body.value.uid && body.value.uid !== req.data.auth.user.id) {
    return next(
      new InvalidRequestDataFailure({
        uid: "Cannot create transaction for another user id",
      })
    );
  }

  /**
   * Generate ID or use provided ID
   */
  const id = body.value.id || uuid();

  /**
   * Check no transaction already exists with given ID
   */
  const existing = await prisma.transaction.findUnique({
    where: { id: id },
  });

  if (existing) {
    return next(new TransactionAlreadyExistsFailure());
  }

  /**
   * Create new transaction from body
   */
  const created = await prisma.transaction.create({
    data: {
      id,
      user: { connect: { id: req.data.auth.user.id } },
      integerAmount: body.value.integerAmount,
      category: body.value.category,
      comment: body.value.comment,
      time: new Date(body.value.time),
    },
  });

  /**
   * Send created transaction to user
   */
  return res.status(201).json(mapTransactionToResponse(created));
});
