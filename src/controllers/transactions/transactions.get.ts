import * as compression from "compression";
import * as z from "zod";
import { transactionsRouter } from "..";
import { TimestampMsString } from "../../schemas/utils.schema";
import { prisma } from "../../server";
import { TransactionService } from "../../services/TransactionService";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { validateOr } from "../../utils/validate";

export const getTransactionsQueryParametersSchema = z.object({
  after: TimestampMsString.optional(),
  before: TimestampMsString.optional(),
});

transactionsRouter.get("/", compression(), async (req, res, next) => {
  try {
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    const params = validateOr(req.query, getTransactionsQueryParametersSchema, {
      after: undefined,
      before: undefined,
    });

    const parsedParams = {
      after: params.after ? new Date(Number(params.after)) : undefined,
      before: params.before ? new Date(Number(params.before)) : undefined,
    };

    /**
     * Get all transactions for user
     */
    const transactions = await prisma.transaction.findMany({
      where: {
        uid: {
          equals: req.data.auth.user.id,
        },
        time: {
          gte: parsedParams.after,
          lte: parsedParams.before,
        },
      },
      include: {
        Category: true,
      },
    });

    /**
     * Send transactions to user
     */
    res.json(TransactionService.compressTransactions(transactions));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
