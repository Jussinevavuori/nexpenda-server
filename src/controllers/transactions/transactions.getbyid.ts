import { transactionsRouter } from "..";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { mapTransactionToResponse } from "../../utils/mapTransactionToResponse";

transactionsRouter.get("/", async (req, res, next) => {
  if (!req.data.user) {
    return next(new UnauthenticatedFailure());
  }

  /**
   * Get all transactions for user
   */
  const transaction = await getProtectedTransaction(
    req.data.user,
    req.params.id
  );

  if (transaction.isFailure()) {
    return next(transaction);
  }

  /**
   * Send transactions to user
   */
  return res.json(mapTransactionToResponse(transaction.value));
});
