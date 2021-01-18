import { array, object, string } from "yup";
import { transactionsRouter } from "../..";
import { corsMiddleware } from "../../../middleware/corsMiddleware";
import { prisma } from "../../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
  UnauthorizedFailure,
} from "../../../utils/Failures";
import { validateRequestBody } from "../../../utils/validateRequestBody";

transactionsRouter.options("/mass/delete", corsMiddleware());

transactionsRouter.post("/mass/delete", async (req, res, next) => {
  try {
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    /**
     * Get deleteable IDs from request params
     */
    const body = await validateRequestBody<{ ids: string[] }>(
      req,
      object({
        ids: array().of(string().defined()).defined(),
      }).defined()
    );

    if (body.isFailure()) {
      return next(body);
    }

    /**
     * Find all transactions and ensure user owns all of them. Dismiss
     * non-existing transacctions.
     */
    const transactions = await prisma.transaction.findMany({
      where: {
        id: {
          in: body.value.ids,
        },
      },
    });

    if (transactions.some((_) => _.uid !== req.data!.auth!.user!.id)) {
      return next(new UnauthorizedFailure());
    }

    /**
     * Delete transactions
     */
    await prisma.transaction.deleteMany({
      where: {
        id: {
          in: transactions.map((_) => _.id),
        },
      },
    });

    /**
     * Respond with 204
     */
    return res.status(204).end();
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
