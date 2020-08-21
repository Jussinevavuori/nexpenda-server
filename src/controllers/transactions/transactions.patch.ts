import { transactionsRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { TransactionNotFoundError } from "../../errors/TransactionNotFoundError";
import { patchTransactionSchema } from "../../schemas/transaction.schema";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { prisma } from "../../server";
import { InvalidRequestDataError } from "../../errors/InvalidRequestDataError";
import { respondWithTransaction } from "../../utils/respondWithTransactions";

transactionsRouter.patch(
  "/:id",
  protectedRoute(async (user, req, res, next) => {
    try {
      const id = req.params.id;
      const transaction = await getProtectedTransaction(user, id);
      const form = await getValidatedRequestBody(req, patchTransactionSchema);
      if (!transaction) {
        throw new TransactionNotFoundError();
      }
      if (form.id && form.id !== transaction.id) {
        throw new InvalidRequestDataError("Cannot update transaction ID");
      }
      if (form.uid && form.uid !== transaction.uid) {
        throw new InvalidRequestDataError("Cannot update transaction user");
      }
      const updated = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          category: form.category,
          comment: form.comment,
          time: form.time ? new Date(form.time) : undefined,
          integerAmount: form.integerAmount,
        },
      });
      respondWithTransaction(res, updated);
    } catch (error) {
      next(error);
    }
  })
);
