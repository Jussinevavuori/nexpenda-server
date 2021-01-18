import { transactionsRouter } from "..";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { mapTransactionToResponse } from "../../utils/mapTransactionToResponse";

transactionsRouter.get("/:id", async (req, res, next) => {
  try {
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    /**
     * Get all transactions for user
     */
    const transaction = await getProtectedTransaction(
      req.data.auth.user,
      req.params.id
    );

    if (transaction.isFailure()) {
      return next(transaction);
    }

    /**
     * Send transactions to user
     */
    return res.json(mapTransactionToResponse(transaction.value));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
