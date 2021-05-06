import { validateRequestBody } from "../../utils/validateRequestBody";
import { prisma } from "../../server";
import {
  BudgetNotFoundFailure,
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { budgetsRouter } from "..";
import { patchBudgetSchema } from "../../schemas/budget.schema";
import { BudgetService } from "../../services/BudgetService";
import { Failure } from "../../utils/Result";

budgetsRouter.patch("/:id", async (req, res, next) => {
  try {
    // Ensure authenticated
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }
    const uid = req.data.auth.user.id;

    // Ensure query parameter ID provided
    if (!req.params.id) {
      return next(new MissingUrlParametersFailure(["id"]));
    }

    // Get budget
    const budget = await prisma.budget.findUnique({
      where: { id: req.params.id },
      select: {
        uid: true,
        id: true,
        BudgetCategoryInclusions: true,
      },
    });

    // Ensure budget found and belongs to authenticated user
    if (!budget || budget.uid !== uid) {
      return next(new BudgetNotFoundFailure());
    }

    // Validate request body
    const body = await validateRequestBody(req, patchBudgetSchema);
    if (body.isFailure()) {
      return next(body);
    }

    // Ensure all specified categories exist and are owned by authenticated user
    if (body.value.categoryIds) {
      const categoriesValidityCheck = await BudgetService.ensureValidCategoryIds(
        req.data.auth.user,
        body.value.categoryIds,
        prisma
      );

      if (categoriesValidityCheck.isFailure()) {
        return next(categoriesValidityCheck);
      }
    }

    // If specified, manually update category IDs
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

    // Update budget
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
    return res.json(BudgetService.mapBudgetToResponse(updated));
  } catch (error) {
    if (error instanceof Failure) {
      return next(error);
    }
    return next(new DatabaseAccessFailure(error));
  }
});
