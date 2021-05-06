import { transactionsRouter } from "../..";
import { validateRequestBody } from "../../../utils/validateRequestBody";
import { postTransactionsSchema } from "../../../schemas/transaction.schema";
import { prisma } from "../../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../../utils/Failures";
import { TransactionService } from "../../../services/TransactionService";
import { Transaction, Category } from "@prisma/client";

transactionsRouter.post("/mass/post", async (req, res, next) => {
  try {
    // Ensure authenticated
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    // Get request body and validate it
    const body = await validateRequestBody(req, postTransactionsSchema);
    if (body.isFailure()) {
      return next(body);
    }

    // Ensure the user is allowed to create the requested transactions
    const createPermission = await TransactionService.ensureCreatePermission(
      req.data.auth.user,
      body.value.transactions.length
    );
    if (createPermission.isFailure()) {
      return next(createPermission);
    }

    const createdTransactions: Array<Transaction & { Category: Category }> = [];

    for (const transaction of body.value.transactions) {
      const createdTransaction = await prisma.transaction.create({
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
      createdTransactions.push(createdTransaction);
    }

    // Send created transaction to user
    return res
      .status(201)
      .json(TransactionService.compressTransactions(createdTransactions));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
