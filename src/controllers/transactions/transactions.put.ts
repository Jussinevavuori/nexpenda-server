import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { putTransactionSchema } from "../../schemas/transaction.schema";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  InvalidRequestDataFailure,
  MissingUrlParametersFailure,
  TransactionNotFoundFailure,
  UnauthenticatedFailure,
  UnauthorizedFailure,
} from "../../utils/Failures";
import { TransactionService } from "../../services/TransactionService";

transactionsRouter.put("/:id", async (req, res, next) => {
  try {
    // Ensure authenticated
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    // Ensure query parameter ID provided
    if (!req.params.id) {
      return next(new MissingUrlParametersFailure(["id"]));
    }

    // Get potentially existing transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });

    // Ensure potentially existing transaction doesn't belong to authenticated user
    if (transaction && transaction.uid !== req.data.auth.user.id) {
      return next(new TransactionNotFoundFailure());
    }

    // Validate request body
    const body = await validateRequestBody(req, putTransactionSchema);
    if (body.isFailure()) {
      return next(body);
    }

    // Ensure not updating UID
    if (body.value.uid && body.value.uid !== req.data.auth.user.id) {
      return next(
        new InvalidRequestDataFailure({
          uid: "Cannot create transaction for another user id",
        })
      );
    }

    // Ensure ID is not changed if updating transaction
    if (transaction && body.value.id && body.value.id !== transaction.id) {
      return next(
        new InvalidRequestDataFailure({
          id: "Cannot update transaction ID",
        })
      );
    }

    // Ensure UID is not changed if updating transaction
    if (transaction && body.value.uid && body.value.uid !== transaction.uid) {
      return next(
        new InvalidRequestDataFailure({
          uid: "Cannot update transaction owner",
        })
      );
    }

    // Upsert transaction
    const upserted = await prisma.transaction.upsert({
      where: { id: req.params.id },
      create: {
        id: req.params.id,
        integerAmount: body.value.integerAmount,
        comment: body.value.comment,
        time: new Date(body.value.time),
        user: {
          connect: {
            id: req.data.auth.user.id,
          },
        },
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
    return res.json(TransactionService.mapTransactionToResponse(upserted));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
