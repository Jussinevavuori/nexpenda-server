import { transactionsRouter } from "..";
import { prisma } from "../../server";
import { TransactionService } from "../../services/TransactionService";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  TransactionNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

transactionsRouter.get("/:id", async (req, res, next) => {
  try {
    // Ensure authenticated
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    // Ensure query parameter ID provided
    if (!req.params.id) {
      return next(new MissingUrlParametersFailure(["id"]));
    }

    // Get transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: { Category: true },
    });

    // Ensure transaction found and belongs to authenticated user
    if (!transaction || transaction.uid !== req.data.auth.user.id) {
      return next(new TransactionNotFoundFailure());
    }

    // Send transaction to user
    return res.json(TransactionService.mapTransactionToResponse(transaction));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
