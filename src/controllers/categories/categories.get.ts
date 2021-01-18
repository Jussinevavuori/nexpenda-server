import * as compression from "compression";
import { categoriesRouter } from "..";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

categoriesRouter.get("/", compression(), async (req, res, next) => {
  try {
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    /**
     * Get all transactions for user
     */
    const categories = await prisma.category.findMany({
      where: {
        uid: {
          equals: req.data.auth.user.id,
        },
      },
    });

    /**
     * Send transactions to user
     */
    res.json(categories);
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
