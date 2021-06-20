import { transactionsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  TransactionNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { TransactionMapper } from "../../services/TransactionMapper";
import { anyNonNil as isUuid } from "is-uuid";
import { Category } from "@prisma/client";
import { Permissions } from "../../services/Permissions";
import { Schemas } from "../../schemas/Schemas";

/**
 * Upsert a transaction for the user.
 */
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

    // If creating, ensure the user is allowed to create the requested transaction
    if (!transaction) {
      const createPermission = await Permissions.getCreateTransactionPermission(
        req.data.auth.user
      );
      if (createPermission.isFailure()) {
        return next(createPermission);
      }
    }

    // Validate request body
    const body = await validateRequestBody(req, Schemas.Transaction.put);
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
        Schedule: true,
      },
    });

    // Update icon if updated icon given
    let updatedCategory: Category | undefined;
    if (
      body.value.categoryIcon &&
      body.value.categoryIcon !== upserted.Category.icon
    ) {
      updatedCategory = await prisma.category.update({
        where: { id: upserted.Category.id },
        data: { icon: body.value.categoryIcon },
      });
    }

    // Send upserted transaction to user, use updated values if any exist
    // after upserting
    return res.json(
      TransactionMapper.mapTransactionToResponse({
        ...upserted,
        Category: updatedCategory ?? upserted.Category,
      })
    );
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
