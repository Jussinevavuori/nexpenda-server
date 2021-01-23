import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { patchTransactionSchema } from "../../schemas/transaction.schema";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  InvalidRequestDataFailure,
  MissingUrlParametersFailure,
  TransactionNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { TransactionService } from "../../services/TransactionService";

transactionsRouter.patch("/:id", async (req, res, next) => {
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
      include: { category: true },
    });

    // Ensure transaction found and belongs to authenticated user
    if (!transaction || transaction.uid !== req.data.auth.user.id) {
      return next(new TransactionNotFoundFailure());
    }

    // Validate request body
    const body = await validateRequestBody(req, patchTransactionSchema);
    if (body.isFailure()) {
      return next(body);
    }

    // Ensure ID is not being changed
    if (body.value.id && body.value.id !== transaction.id) {
      return next(
        new InvalidRequestDataFailure({
          id: "Cannot update transaction ID",
        })
      );
    }

    // Ensure UID is not being changed
    if (body.value.uid && body.value.uid !== transaction.uid) {
      return next(
        new InvalidRequestDataFailure({
          uid: "Cannot update transaction owner",
        })
      );
    }

    // Update transaction
    const updated = await prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        comment: body.value.comment,
        time: body.value.time ? new Date(body.value.time) : undefined,
        integerAmount: body.value.integerAmount,
        category:
          body.value.category === undefined
            ? undefined
            : {
                connectOrCreate: {
                  where: {
                    value: body.value.category,
                  },
                  create: {
                    value: body.value.category,
                    user: {
                      connect: {
                        id: req.data.auth.user.id,
                      },
                    },
                  },
                },
              },
      },
      include: {
        category: true,
      },
    });

    /**
     * Send updated transaction to user
     */
    return res.json(TransactionService.mapTransactionToResponse(updated));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
