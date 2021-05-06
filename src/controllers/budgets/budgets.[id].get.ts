import { budgetsRouter } from "..";
import { prisma } from "../../server";
import { BudgetService } from "../../services/BudgetService";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  BudgetNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

budgetsRouter.get("/:id", async (req, res, next) => {
  try {
    // Ensure authenticated
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }

    // Ensure query parameter ID provided
    if (!req.params.id) {
      return next(new MissingUrlParametersFailure(["id"]));
    }

    // Get budget
    const budget = await prisma.budget.findUnique({
      where: { id: req.params.id },
      include: { BudgetCategoryInclusions: true },
    });

    // Ensure budget found and belongs to authenticated user
    if (!budget || budget.uid !== req.data.auth.user.id) {
      return next(new BudgetNotFoundFailure());
    }

    // Send budget to user
    return res.json(BudgetService.mapBudgetToResponse(budget));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
