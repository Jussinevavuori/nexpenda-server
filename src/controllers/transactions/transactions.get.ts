import { transactionsRouter } from "..";
import { prisma } from "../../server";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { mapTransactionToResponse } from "../../utils/mapTransactionToResponse";

transactionsRouter.get("/", async (req, res, next) => {
  if (!req.data.user) {
    return next(new UnauthenticatedFailure());
  }

  /**
   * Get all transactions for user
   */
  const transactions = await prisma.transaction.findMany({
    where: { uid: req.data.user.id },
  });

  /**
   * Send transactions to user
   */
  res.json(mapTransactionToResponse(transactions));
});
