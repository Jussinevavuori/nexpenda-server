import { transactionsRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";
import { TransactionNotFoundError } from "../../errors/TransactionNotFoundError";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { prisma } from "../../server";

transactionsRouter.delete(
  "/:id",
  protectedRoute(async (user, req, res, next) => {
    try {
      const id = req.params.id;

      const transaction = await getProtectedTransaction(user, id);

      if (!transaction) {
        throw new TransactionNotFoundError();
      }

      await prisma.transaction.delete({ where: { id: transaction.id } });

      return res.status(204).end();
    } catch (error) {
      next(error);
    }
  })
);

export default transactionsRouter;
