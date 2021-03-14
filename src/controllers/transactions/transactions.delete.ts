import { transactionsRouter } from "..";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  TransactionNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

transactionsRouter.delete("/:id", async (req, res, next) => {
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

    // Delete transaction
    await prisma.transaction.delete({ where: { id: transaction.id } });

    // Respond with 204 and deleted ID for succesful deletion
    return res.status(204).send({ id: transaction.id });
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
