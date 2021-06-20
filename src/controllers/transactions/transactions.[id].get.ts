import { transactionsRouter } from "..";
import { prisma } from "../../server";
import { TransactionMapper } from "../../services/TransactionMapper";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  TransactionNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

/**
 * Fetch a single transaction the user owns.
 */
transactionsRouter.get("/:id", async (req, res, next) => {
  try {
    /**
     * Ensure authenticated
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Ensure query parameter provided
     */
    if (!req.params.id) return next(new MissingUrlParametersFailure(["id"]));

    /**
     * Get transaction
     */
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: {
        Category: true,
        Schedule: true,
      },
    });

    /**
     * Ensure transaction exists and belongs to caller
     */
    if (!transaction || transaction.uid !== req.data.auth.user.id) {
      return next(new TransactionNotFoundFailure());
    }

    /**
     * Send transaction to user
     */
    return res.json(TransactionMapper.mapTransactionToResponse(transaction));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
