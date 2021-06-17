import { budgetsRouter } from "..";
import { prisma } from "../../server";
import { BudgetMapper } from "../../services/BudgetMapper";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  BudgetNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

/**
 * Fetch a single budget the user owns.
 */
budgetsRouter.get("/:id", async (req, res, next) => {
  try {
    /**
     * Ensure authenticated
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());

    /**
     * Ensure query parameter provided
     */
    if (!req.params.id) return next(new MissingUrlParametersFailure(["id"]));

    /**
     * Get budget
     */
    const budget = await prisma.budget.findUnique({
      where: { id: req.params.id },
      include: { BudgetCategoryInclusions: true },
    });

    /**
     * Ensure budget exists and belongs to caller
     */
    if (!budget || budget.uid !== req.data.auth.user.id) {
      return next(new BudgetNotFoundFailure());
    }

    /**
     * Respond with budget
     */
    return res.json(BudgetMapper.mapBudgetToResponse(budget));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
