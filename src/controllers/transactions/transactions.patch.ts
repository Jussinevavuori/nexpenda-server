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
import { Category } from "@prisma/client";
import { Schemas } from "../../schemas/Schemas";

/**
 * Partially update a single transaction the user owns.
 */
transactionsRouter.patch("/:id", async (req, res, next) => {
  try {
    /**
     * Ensure authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Ensure query parameters provided
     */
    if (!req.params.id) return next(new MissingUrlParametersFailure(["id"]));

    /**
     * Get transaction that is being updated
     */
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: { Category: true },
    });

    /**
     * Ensure transaction belongs to caller
     */
    if (!transaction || transaction.uid !== req.data.auth.user.id) {
      return next(new TransactionNotFoundFailure());
    }

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Transaction.patch);
    if (body.isFailure()) return next(body);

    /**
     * Update transaction
     */
    const updated = await prisma.transaction.update({
      where: {
        id: transaction.id,
      },
      data: {
        comment: body.value.comment,
        time: body.value.time ? new Date(body.value.time) : undefined,
        integerAmount: body.value.integerAmount,
        Category:
          body.value.category === undefined
            ? undefined
            : {
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

    /**
     * Update category icon if new icon provided
     */
    let updatedCategory: Category | undefined;
    if (
      body.value.categoryIcon &&
      body.value.categoryIcon !== updated.Category.icon
    ) {
      updatedCategory = await prisma.category.update({
        where: {
          id: updated.Category.id,
        },
        data: {
          icon: body.value.categoryIcon,
        },
      });
    }

    /**
     * Respond with updated data
     */
    return res.json(
      TransactionMapper.mapTransactionToResponse({
        ...updated,
        Category: updatedCategory ?? updated.Category,
      })
    );
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
