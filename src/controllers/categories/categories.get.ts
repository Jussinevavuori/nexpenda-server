import * as compression from "compression";
import { categoriesRouter } from "../../routers";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";

/**
 * Fetch all categories the user owns.
 */
categoriesRouter.get("/", compression(), async (req, res, next) => {
  try {
    /**
     * Require authentication
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Get all categories for user
     */
    const categories = await prisma.category.findMany({
      where: { uid: req.data.auth.user.id },
    });

    /**
     * Send categories to user
     */
    res.json(categories);
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
