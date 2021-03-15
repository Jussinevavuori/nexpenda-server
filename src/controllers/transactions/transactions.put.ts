import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { putTransactionSchema } from "../../schemas/transaction.schema";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  TransactionNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { TransactionService } from "../../services/TransactionService";
import { anyNonNil as isUuid } from "is-uuid";

transactionsRouter.put("/:id", async (req, res, next) => {
  try {
    // Ensure authenticated
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    // Ensure query parameter ID provided
    if (!req.params.id && isUuid(req.params.id)) {
      return next(new MissingUrlParametersFailure(["id"]));
    }

    // Get potentially existing transaction
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: { Category: true },
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

    // Upsert transaction
    const upserted = await prisma.transaction.upsert({
      where: { id: req.params.id },
      create: {
        id: req.params.id,
        integerAmount: body.value.integerAmount,
        comment: body.value.comment,
        time: new Date(body.value.time),
        User: {
          connect: {
            id: req.data.auth.user.id,
          },
        },
        Category: {
          connectOrCreate: {
            where: {
              unique_uid_value: {
                uid: req.data.auth.user.id,
                value: body.value.category,
              },
            },
            create: {
              value: body.value.category,
              User: {
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
        Category: {
          connectOrCreate: {
            where: {
              unique_uid_value: {
                uid: req.data.auth.user.id,
                value: body.value.category,
              },
            },
            create: {
              value: body.value.category,
              User: {
                connect: {
                  id: req.data.auth.user.id,
                },
              },
            },
          },
        },
      },
      include: {
        Category: true,
      },
    });

    // Update icon if updated icon given
    if (
      body.value.categoryIcon &&
      body.value.categoryIcon !== upserted.Category.icon
    ) {
      const updatedCategory = await prisma.category.update({
        where: {
          id: upserted.Category.id,
        },
        data: {
          icon: body.value.categoryIcon,
        },
      });

      // Short-circuit and send transaction and updatedcategory to user
      return res.json(
        TransactionService.mapTransactionToResponse({
          ...upserted,
          Category: updatedCategory,
        })
      );
    }

    // Send upserted transaction to user
    return res.json(TransactionService.mapTransactionToResponse(upserted));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
