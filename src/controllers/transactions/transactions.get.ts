import * as compression from "compression";
import { transactionsRouter } from "..";
import { prisma } from "../../server";
import { compressTransactions } from "../../utils/compressTransactions";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

transactionsRouter.get("/", compression(), async (req, res, next) => {
  try {
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    /**
     * Get all transactions for user
     */
    const transactions = await prisma.transaction.findMany({
      where: {
        uid: {
          equals: req.data.auth.user.id,
        },
      },
      include: {
        category: true,
      },
    });

    /**
     * Send transactions to user
     */
    res.json(compressTransactions(transactions));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
