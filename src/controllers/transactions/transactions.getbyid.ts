import { transactionsRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";
import { TransactionNotFoundError } from "../../errors/TransactionNotFoundError";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { respondWithTransaction } from "../../utils/respondWithTransactions";

transactionsRouter.get(
  "/:id",
  protectedRoute(async (user, req, res, next) => {
    try {
      const id = req.params.id;
      const transaction = await getProtectedTransaction(user, id);
      if (!transaction) {
        throw new TransactionNotFoundError();
      }
      respondWithTransaction(res, transaction);
    } catch (error) {
      next(error);
    }
  })
);
