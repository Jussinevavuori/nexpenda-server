import { transactionsRouter } from "..";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { prisma } from "../../server";
import { UnauthenticatedFailure } from "../../utils/Failures";

transactionsRouter.delete("/:id", async (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }

  /**
   * Get ID from request params
   */
  const id = req.params.id;

  /**
   * Find user's transaction with given ID
   */
  const transaction = await getProtectedTransaction(req.data.auth.user, id);

  if (transaction.isFailure()) {
    return next(transaction);
  }

  /**
   * Delete transaction
   */
  await prisma.transaction.delete({ where: { id: transaction.value.id } });

  /**
   * Respond with 204
   */
  return res.status(204).end();
});
