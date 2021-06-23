import { transactionsRouter } from "..";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  TransactionNotFoundFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";

/**
 * Delete a single transaction the user owns.
 */
transactionsRouter.delete("/:id", async (req, res, next) => {
  try {
    /**
     * Ensure authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Ensure query parameters provided
     */
    if (!req.params.id) return next(new MissingUrlParametersFailure(["id"]));

    /**
     * Get transaction that is being updated
     */
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: { Category: true },
    });

    /**
     * Ensure transaction belongs to caller
     */
    if (!transaction || transaction.uid !== req.data.auth.user.id) {
      return next(new TransactionNotFoundFailure());
    }

    /**
     * Delete transaction
     */
    await prisma.transaction.delete({ where: { id: transaction.id } });

    /**
     * Respond with 200 and ID of deleted transaction
     */
    return res.status(200).json({ id: transaction.id });
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
