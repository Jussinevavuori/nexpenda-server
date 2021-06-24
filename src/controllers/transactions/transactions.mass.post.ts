import { transactionsRouter } from "../../routers";
import { validateRequestBody } from "../../lib/validation/validateRequestBody";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { TransactionMapper } from "../../lib/dataMappers/TransactionMapper";
import { Transaction, Category } from "@prisma/client";
import { Permissions } from "../../lib/permission/Permissions";
import { Schemas } from "../../lib/schemas/Schemas";

/**
 * Create multiple transactions for the user
 */
transactionsRouter.post("/mass/post", async (req, res, next) => {
  try {
    /**
     * Ensure authenticated
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Transaction.postMany);
    if (body.isFailure()) return next(body);

    /**
     * Ensure the user is allowed to create transactions
     */
    const permission = await Permissions.getCreateTransactionPermission(
      req.data.auth.user,
      body.value.transactions.length
    );
    if (permission.isFailure()) return next(permission);

    /**
     * Create all transactions one by one
     */
    const createdTransactions: Array<Transaction & { Category: Category }> = [];
    for (const transaction of body.value.transactions) {
      const created = await prisma.transaction.create({
        data: {
          integerAmount: transaction.integerAmount,
          comment: transaction.comment,
          time: new Date(transaction.time),
          User: {
            connect: {
              id: req.data!.auth!.user!.id,
            },
          },
          Category: {
            connectOrCreate: {
              where: {
                unique_uid_value: {
                  uid: req.data!.auth!.user!.id,
                  value: transaction.category,
                },
              },
              create: {
                value: transaction.category,
                User: {
                  connect: {
                    id: req.data!.auth!.user!.id,
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

      /**
       * Update category icon if new icon provided in request.
       */
      let updatedCategory: Category | undefined;
      if (
        transaction.categoryIcon &&
        transaction.categoryIcon !== created.Category.icon
      ) {
        updatedCategory = await prisma.category.update({
          where: { id: created.Category.id },
          data: { icon: transaction.categoryIcon },
        });
      }

      /**
       * Add created to array to return to user with potential updated data.
       */
      createdTransactions.push({
        ...created,
        Category: updatedCategory ?? created.Category,
      });
    }

    /**
     * Send created transactions to user
     */
    return res
      .status(201)
      .json(TransactionMapper.compressTransactions(createdTransactions));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
