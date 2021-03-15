import * as compression from "compression";
import { budgetsRouter } from "..";
import { prisma } from "../../server";
import { BudgetService } from "../../services/BudgetService";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

budgetsRouter.get("/", compression(), async (req, res, next) => {
  try {
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    /**
     * Get all budgets for user
     */
    const budgets = await prisma.budget.findMany({
      where: {
        uid: req.data.auth.user.id,
      },
      include: {
        BudgetCategoryInclusions: true,
      },
    });

    /**
     * Send budgets to user
     */
    res.json(BudgetService.mapBudgetToResponse(budgets));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
