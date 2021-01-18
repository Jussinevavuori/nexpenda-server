import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { putTransactionSchema } from "../../schemas/transaction.schema";
import { getProtectedTransaction } from "../../utils/getProtectedTransaction";
import { prisma } from "../../server";
import { getUnprotectedTransaction } from "../../utils/getUnprotectedTransaction";
import {
  DatabaseAccessFailure,
  InvalidRequestDataFailure,
  UnauthenticatedFailure,
  UnauthorizedFailure,
} from "../../utils/Failures";
import { mapTransactionToResponse } from "../../utils/mapTransactionToResponse";

transactionsRouter.put("/:id", async (req, res, next) => {
  try {
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    /**
     * Get ID from request parameters
     */
    const id = req.params.id;

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, putTransactionSchema);

    if (body.isFailure()) {
      return next(body);
    }

    /**
     * Get transaction for user
     */
    const transaction = await getProtectedTransaction(req.data.auth.user, id);
    const unprotectedTransaction = await getUnprotectedTransaction(id);

    if (transaction.isFailure()) {
      if (unprotectedTransaction.isSuccess()) {
        return next(
          new UnauthorizedFailure().withMessage(
            "Cannot update another user's transactions."
          )
        );
      } else if (body.value.uid && body.value.uid !== req.data.auth.user.id) {
        return next(
          new InvalidRequestDataFailure({
            uid: "Cannot create transaction for another user id",
          })
        );
      }
    }

    /**
     * Validate when updating resource
     */
    if (transaction.isSuccess()) {
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
    }

    /**
     * Upsert transaction
     */
    const upserted = await prisma.transaction.upsert({
      where: { id },
      create: {
        id,
        user: { connect: { id: req.data.auth.user.id } },
        integerAmount: body.value.integerAmount,
        comment: body.value.comment,
        time: new Date(body.value.time),
        category: {
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
      update: {
        integerAmount: body.value.integerAmount,
        time: new Date(body.value.time),
        comment: body.value.comment === undefined ? null : body.value.comment,
        category: {
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
     * Send upserted transaction to user
     */
    return res.json(mapTransactionToResponse(upserted));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
