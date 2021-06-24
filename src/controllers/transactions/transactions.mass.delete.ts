import { transactionsRouter } from "../../routers";
import { corsMiddleware } from "../../middleware/corsMiddleware";
import { Schemas } from "../../lib/schemas/Schemas";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { validateRequestBody } from "../../lib/validation/validateRequestBody";

/**
 * Preflight options for the mass deletion endpoint
 */
transactionsRouter.options("/mass/delete", corsMiddleware());

/**
 * Delete multiple user's transactions
 */
transactionsRouter.post("/mass/delete", async (req, res, next) => {
  try {
    /**
     * Ensure authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Transaction.deleteMany);
    if (body.isFailure()) return next(body);

    /**
     * Delete transactions
     */
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

    /**
     * Respond with 200 and number of deleted items
     */
    return res.status(200).send({ deletedCount: result.count });
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
