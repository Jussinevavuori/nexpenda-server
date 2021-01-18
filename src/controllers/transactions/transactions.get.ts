import * as compression from "compression";
import { transactionsRouter } from "..";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { mapTransactionToResponse } from "../../utils/mapTransactionToResponse";

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
    res.json(mapTransactionToResponse(transactions));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
