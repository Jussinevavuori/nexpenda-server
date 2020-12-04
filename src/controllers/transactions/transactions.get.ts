import { transactionsRouter } from "..";
import { prisma } from "../../server";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { mapTransactionToResponse } from "../../utils/mapTransactionToResponse";

transactionsRouter.get("/", async (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }

  /**
   * Get all transactions for user
   */
  const transactions = await prisma.transaction.findMany({
    where: {
			uid: {
				equals: req.data.auth.user.id
			}
		}
  });

  /**
   * Send transactions to user
   */
  res.json(mapTransactionToResponse(transactions));
});
