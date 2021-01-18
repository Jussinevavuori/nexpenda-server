import { transactionsRouter } from "../..";
import { validateRequestBody } from "../../../utils/validateRequestBody";
import {
  PostTransactionSchema,
  postTransactionSchema,
} from "../../../schemas/transaction.schema";
import { prisma } from "../../../server";
import { v4 as uuid } from "uuid";
import { mapTransactionToResponse } from "../../../utils/mapTransactionToResponse";
import {
  DatabaseAccessFailure,
  InvalidRequestDataFailure,
  TransactionAlreadyExistsFailure,
  UnauthenticatedFailure,
} from "../../../utils/Failures";
import { array, object } from "yup";

transactionsRouter.post("/mass/post", async (req, res, next) => {
  try {
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    /**
     * Get request body and validate it
     */
    const body = await validateRequestBody<{
      transactions: PostTransactionSchema[];
    }>(
      req,
      object({
        transactions: array().of(postTransactionSchema).defined(),
      }).defined()
    );

    if (body.isFailure()) {
      return next(body);
    }

    /**
     * Ensure UID is same as authenticated user's if it exists
     */
    const invalidUids = body.value.transactions.some((_) => {
      _.uid && _.uid !== req.data.auth!.user!.id;
    });
    if (invalidUids) {
      return next(
        new InvalidRequestDataFailure({
          uid: "Cannot create transactions for another user id",
        })
      );
    }

    /**
     * Generate IDs or use provided IDs
     */
    const transactionsWithIds = body.value.transactions.map((_) => {
      return {
        ..._,
        id: _.id || uuid(),
      };
    });

    /**
     * Check no transaction already exists with IDs
     */
    const allExisting = await Promise.all(
      transactionsWithIds.map((_) => {
        return prisma.transaction.findUnique({
          where: { id: _.id },
        });
      })
    );

    if (allExisting.some((_) => _ !== null)) {
      return next(new TransactionAlreadyExistsFailure());
    }

    /**
     * Create new transactions from body
     */
    const allCreated = await Promise.all(
      transactionsWithIds.map((_) => {
        return prisma.transaction.create({
          data: {
            id: _.id,
            user: { connect: { id: req.data!.auth!.user!.id } },
            integerAmount: _.integerAmount,
            category: {
              connectOrCreate: {
                where: {
                  value: _.category,
                },
                create: {
                  value: _.category,
                  user: {
                    connect: {
                      id: req.data!.auth!.user!.id,
                    },
                  },
                },
              },
            },
            comment: _.comment,
            time: new Date(_.time),
          },
        });
      })
    );
    /**
     * Send created transaction to user
     */
    return res.status(201).json(mapTransactionToResponse(allCreated));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
