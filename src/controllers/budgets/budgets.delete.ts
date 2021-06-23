import { budgetsRouter } from "..";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  BudgetNotFoundFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";

/**
 * Delete a single budget the user owns.
 */
budgetsRouter.delete("/:id", async (req, res, next) => {
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
     * Delete all budget data
     */
    await prisma.budgetCategoryInclusion.deleteMany({
      where: { budgetId: budget.id },
    });
    await prisma.budget.delete({ where: { id: budget.id } });

    /**
     * Respond with 200 and ID of deleted budget
     */
    return res.status(200).send({ id: budget.id });
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
