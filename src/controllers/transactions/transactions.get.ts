import { transactionsRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";
import { prisma } from "../../server";
import { respondWithTransactions } from "../../utils/respondWithTransactions";

transactionsRouter.get(
  "/",
  protectedRoute(async (user, req, res, next) => {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { uid: user.id },
      });
      respondWithTransactions(res, transactions);
    } catch (error) {
      next(error);
    }
  })
);
