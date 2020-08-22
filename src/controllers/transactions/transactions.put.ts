import { transactionsRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { TransactionNotFoundError } from "../../errors/TransactionNotFoundError";
import { putTransactionSchema } from "../../schemas/transaction.schema";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { prisma } from "../../server";
import { InvalidRequestDataError } from "../../errors/InvalidRequestDataError";
import { v4 as uuid } from "uuid";
import { respondWithTransaction } from "../../utils/respondWithTransactions";

transactionsRouter.put(
  "/:id",
  protectedRoute(async (user, req, res, next) => {
    try {
      const id = req.params.id;
      const transaction = await getProtectedTransaction(user, id);
      const form = await getValidatedRequestBody(req, putTransactionSchema);
      if (form.id && form.id !== id) {
        throw new InvalidRequestDataError("Cannot update transaction ID");
      }
      if (form.uid && form.uid !== user.id) {
        throw new InvalidRequestDataError("Cannot update transaction user");
      }
      const upserted = await prisma.transaction.upsert({
        where: { id },
        create: {
          id,
          user: { connect: { id: user.id } },
          integerAmount: form.integerAmount,
          category: form.category,
          comment: form.comment,
          time: new Date(form.time),
        },
        update: {
          integerAmount: form.integerAmount,
          category: form.category,
          time: new Date(form.time),
          comment: form.comment === undefined ? null : form.comment,
        },
      });
      respondWithTransaction(res, upserted);
    } catch (error) {
      next(error);
    }
  })
);
