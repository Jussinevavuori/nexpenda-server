import { transactionsRouter } from "../../routers";
import { validateRequestBody } from "../../lib/validation/validateRequestBody";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { TransactionMapper } from "../../lib/dataMappers/TransactionMapper";
import { Permissions } from "../../lib/permission/Permissions";
import { Category } from "@prisma/client";
import { Schemas } from "../../lib/schemas/Schemas";

/**
 * Create a new transaction for the user.
 */
transactionsRouter.post("/", async (req, res, next) => {
  try {
    /**
     * Ensure authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Transaction.post);
    if (body.isFailure()) return next(body);

    /**
     * Ensure the user is allowed to create transactions
     */
    const permission = await Permissions.getCreateTransactionPermission(
      req.data.auth.user
    );
    if (permission.isFailure()) return next(permission);

    /**
     * Create new transaction from body.
     */
    const created = await prisma.transaction.create({
      data: {
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
        integerAmount: body.value.integerAmount,
        comment: body.value.comment,
        time: new Date(body.value.time),
      },
      include: {
        Category: true,
        Schedule: true,
      },
    });

    /**
     * Update category icon if new icon provided in request.
     */
    let updatedCategory: Category | undefined;
    if (
      body.value.categoryIcon &&
      body.value.categoryIcon !== created.Category.icon
    ) {
      updatedCategory = await prisma.category.update({
        where: { id: created.Category.id },
        data: { icon: body.value.categoryIcon },
      });
    }

    /**
     * Send created transaction to user with 201 status.
     */
    return res.status(201).json(
      TransactionMapper.mapTransactionsToResponse({
        ...created,
        Category: updatedCategory ?? created.Category,
      })
    );
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
