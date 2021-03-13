import { transactionsRouter } from "../..";
import { corsMiddleware } from "../../../middleware/corsMiddleware";
import { deleteTransactionsSchema } from "../../../schemas/transaction.schema";
import { prisma } from "../../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../../utils/Failures";
import { validateRequestBody } from "../../../utils/validateRequestBody";

transactionsRouter.options("/mass/delete", corsMiddleware());

transactionsRouter.post("/mass/delete", async (req, res, next) => {
  try {
    // Ensure authenticated
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    // Validate request body
    const body = await validateRequestBody(req, deleteTransactionsSchema);
    if (body.isFailure()) {
      return next(body);
    }

    // Delete transactions
    const result = await prisma.transaction.deleteMany({
      where: {
        id: {
          in: body.value.ids,
        },
        uid: {
          equals: req.data.auth.user.id,
        },
      },
    });

    // Respond with 204 and number of deleted items
    return res.status(204).send({ deletedCount: result.count });
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
