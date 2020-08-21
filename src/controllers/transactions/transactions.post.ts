import { transactionsRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";
import { getValidatedRequestBody } from "../../utils/getValidatedRequestBody";
import { postTransactionSchema } from "../../schemas/transaction.schema";
import { prisma } from "../../server";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { v4 as uuid } from "uuid";
import { respondWithTransaction } from "../../utils/respondWithTransactions";

transactionsRouter.post(
  "/",
  protectedRoute(async (user, req, res, next) => {
    try {
      const form = await getValidatedRequestBody(req, postTransactionSchema);
      if (form.uid && form.uid !== user.id) {
        throw new UnauthorizedError(
          "Cannot create transaction for another user"
        );
      }
      const created = await prisma.transaction.create({
        data: {
          user: { connect: { id: user.id } },
          id: form.id || uuid(),
          integerAmount: form.integerAmount,
          category: form.category,
          comment: form.comment,
          time: new Date(form.time),
        },
      });
      res.status(201);
      respondWithTransaction(res, created);
    } catch (error) {
      next(error);
    }
  })
);
