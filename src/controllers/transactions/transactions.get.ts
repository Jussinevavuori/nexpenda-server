import * as compression from "compression";
import { transactionsRouter } from "..";
import { prisma } from "../../server";
import { TransactionService } from "../../services/TransactionService";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

transactionsRouter.get("/", compression(), async (req, res, next) => {
  try {
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

		const start =  new Date()

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

		const end =  new Date()

		const ms = end.getTime() - start.getTime()

		console.log(`Fetching ${transactions.length} transactions took ${ms}ms`)

    /**
     * Send transactions to user
     */
    res.json(TransactionService.compressTransactions(transactions));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
