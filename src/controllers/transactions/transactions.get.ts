import * as compression from "compression";
import { transactionsRouter } from "..";
import { Schemas } from "../../schemas/Schemas";
import { prisma } from "../../server";
import { TransactionMapper } from "../../services/TransactionMapper";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { getQuery } from "../../utils/getQuery";

/**
 * Fetch all transactions the user owns.
 */
transactionsRouter.get("/", compression(), async (req, res, next) => {
  try {
    /**
     * Ensure authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Validate query parameters
     */
    const query = getQuery(req, Schemas.Transaction.getQuery);

    /**
     * Get all transactions for user
     */
    const transactions = await prisma.transaction.findMany({
      where: {
        uid: {
          equals: req.data.auth.user.id,
        },
        time: {
          gte: query.after,
          lte: query.before,
        },
      },
      include: {
        Category: true,
      },
    });

    /**
     * Send transactions to user
     */
    res.json(TransactionMapper.compressTransactions(transactions));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
