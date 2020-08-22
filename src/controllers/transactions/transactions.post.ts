import { transactionsRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { postTransactionSchema } from "../../schemas/transaction.schema";
import { prisma } from "../../server";
import { v4 as uuid } from "uuid";
import { respondWithTransaction } from "../../utils/respondWithTransactions";
import { TransactionAlreadyExistsError } from "../../errors/TransactionAlreadyExistsError";
import { InvalidRequestDataError } from "../../errors/InvalidRequestDataError";

transactionsRouter.post(
  "/",
  protectedRoute(async (user, req, res, next) => {
    try {
      const form = await getValidatedRequestBody(req, postTransactionSchema);

      if (form.uid && form.uid !== user.id) {
        throw new InvalidRequestDataError(
          "Cannot create transaction for another user id"
        );
      }

      const id = form.id || uuid();

      const existing = await prisma.transaction.findOne({
        where: { id: id },
      });

      if (existing) {
        throw new TransactionAlreadyExistsError();
      }

      // Create new id from form
      const created = await prisma.transaction.create({
        data: {
          id,
          user: { connect: { id: user.id } },
          integerAmount: form.integerAmount,
          category: form.category,
          comment: form.comment,
          time: new Date(form.time),
        },
      });

      respondWithTransaction(res.status(201), created);
    } catch (error) {
      next(error);
    }
  })
);
