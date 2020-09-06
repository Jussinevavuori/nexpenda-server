import { transactionsRouter } from "..";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { respondWithTransaction } from "../../utils/respondWithTransactions";
import { Route } from "../../utils/Route";

new Route(transactionsRouter, "/:id").protected.get(async (user, req, res) => {
  /**
   * Get ID from request params
   */
  const id = req.params.id;

  /**
   * Get user's transaction with ID
   */
  const transaction = await getProtectedTransaction(user, id);

  if (transaction.isFailure()) {
    return transaction;
  }

  /**
   * Send transaction to user
   */
  respondWithTransaction(res, transaction.value);
});
