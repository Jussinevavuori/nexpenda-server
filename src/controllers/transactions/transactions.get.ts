import { transactionsRouter } from "..";
import { prisma } from "../../server";
import { respondWithTransactions } from "../../utils/respondWithTransactions";
import { Route } from "../../utils/Route";

new Route(transactionsRouter, "/").protected.get(async (user, req, res) => {
  /**
   * Get all transactions for user
   */
  const transactions = await prisma.transaction.findMany({
    where: { uid: user.id },
  });

  /**
   * Send transactions to user
   */
  respondWithTransactions(res, transactions);
});
