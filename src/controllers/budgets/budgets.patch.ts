import { validateRequestBody } from "../../lib/validation/validateRequestBody";
import { prisma } from "../../server";
import {
  BudgetNotFoundFailure,
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { budgetsRouter } from "../../routers";
import { BudgetMapper } from "../../lib/dataMappers/BudgetMapper";
import { Failure } from "../../lib/result/Result";
import { BudgetCategoryValidator } from "../../lib/budgets/BudgetCategoryValidator";
import { Schemas } from "../../lib/schemas/Schemas";

/**
 * Partially update a single budget the user owns.
 */
budgetsRouter.patch("/:id", async (req, res, next) => {
  try {
    /**
     * Ensure authenticated
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());
    const uid = req.data.auth.user.id;

    /**
     * Ensure query parameters provided
     */
    if (!req.params.id) return next(new MissingUrlParametersFailure(["id"]));

    /**
     * Get budget
     */
    const budget = await prisma.budget.findUnique({
      where: { id: req.params.id },
      select: {
        uid: true,
        id: true,
        BudgetCategoryInclusions: true,
      },
    });

    /**
     * Ensure budget exists and belongs to caller
     */
    if (!budget || budget.uid !== uid) {
      return next(new BudgetNotFoundFailure());
    }

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Budget.patch);
    if (body.isFailure()) return next(body);

    /**
     * Ensure all specified categories exist and are owned by authenticated user
     */
    if (body.value.categoryIds) {
      const categoryCheck = await BudgetCategoryValidator.validateCategoryIds(
        req.data.auth.user,
        body.value.categoryIds,
        prisma
      );

      if (categoryCheck.isFailure()) return next(categoryCheck);
    }

    /**
     * If specified, manually update category IDs
     */
    if (body.value.categoryIds) {
      await prisma.budgetCategoryInclusion.deleteMany({
        where: { budgetId: budget.id },
      });
      for (const categoryId of body.value.categoryIds) {
        await prisma.budgetCategoryInclusion.create({
          data: {
            Budget: { connect: { id: budget.id } },
            Category: { connect: { id: categoryId } },
          },
        });
      }
    }

    /**
     * Update budget
     */
    const updated = await prisma.budget.update({
      where: { id: budget.id },
      data: {
        integerAmount: body.value.integerAmount,
        label: body.value.label,
        periodMonths: body.value.periodMonths,
      },
      include: { BudgetCategoryInclusions: true },
    });

    // Send updated budget to user
    return res.json(BudgetMapper.mapBudgetToResponse(updated));
  } catch (error) {
    if (error instanceof Failure) {
      return next(error);
    }
    return next(new DatabaseAccessFailure(error));
  }
});
