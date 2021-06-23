import * as compression from "compression";
import { budgetsRouter } from "..";
import { prisma } from "../../server";
import { BudgetMapper } from "../../lib/dataMappers/BudgetMapper";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";

/**
 * Get all budgets the user owns.
 */
budgetsRouter.get("/", compression(), async (req, res, next) => {
  try {
    /**
     * Ensure authenticated
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Get all budgets for user
     */
    const budgets = await prisma.budget.findMany({
      where: { uid: req.data.auth.user.id },
      include: { BudgetCategoryInclusions: true },
    });

    /**
     * Send budgets to user
     */
    res.json(BudgetMapper.mapBudgetToResponse(budgets));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
