import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { patchTransactionSchema } from "../../schemas/transaction.schema";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { prisma } from "../../server";
import { mapTransactionToResponse } from "../../utils/mapTransactionToResponse";
import {
  DatabaseAccessFailure,
  InvalidRequestDataFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

transactionsRouter.patch("/:id", async (req, res, next) => {
  try {
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    /**
     * Get ID from request parameters
     */
    const id = req.params.id;

    /**
     * Get transaction for user
     */
    const transaction = await getProtectedTransaction(req.data.auth.user, id);

    if (transaction.isFailure()) {
      return next(transaction);
    }

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, patchTransactionSchema);

    if (body.isFailure()) {
      return next(body);
    }

    /**
     * Ensure ID is not changed
     */
    if (body.value.id && body.value.id !== transaction.value.id) {
      return next(
        new InvalidRequestDataFailure({
          id: "Cannot update transaction ID",
        })
      );
    }

    /**
     * Ensure UID is not changed
     */
    if (body.value.uid && body.value.uid !== transaction.value.uid) {
      return next(
        new InvalidRequestDataFailure({
          uid: "Cannot update transaction owner",
        })
      );
    }

    /**
     * Update transaction
     */
    const updated = await prisma.transaction.update({
      where: { id: transaction.value.id },
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
    return res.json(mapTransactionToResponse(updated));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
