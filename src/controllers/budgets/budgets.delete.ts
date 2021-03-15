import { budgetsRouter } from "..";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  BudgetNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";

budgetsRouter.delete("/:id", async (req, res, next) => {
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
    });

    // Ensure budget found and belongs to authenticated user
    if (!budget || budget.uid !== req.data.auth.user.id) {
      return next(new BudgetNotFoundFailure());
    }

    // Delete all budget category inclusions
    await prisma.budgetCategoryInclusion.deleteMany({
      where: {
        budgetId: budget.id,
      },
    });

    // Delete budget
    await prisma.budget.delete({ where: { id: budget.id } });

    // Respond with 204 and deleted ID for succesful deletion
    return res.status(200).send({ id: budget.id });
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
