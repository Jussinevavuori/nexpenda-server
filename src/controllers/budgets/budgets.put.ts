import { budgetsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { putBudgetSchema } from "../../schemas/budget.schema";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  BudgetNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { BudgetService } from "../../services/BudgetService";
import { anyNonNil as isUuid } from "is-uuid";

budgetsRouter.put("/:id", async (req, res, next) => {
  try {
    // Ensure authenticated
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }
    const uid = req.data.auth.user.id;

    // Ensure query parameter ID provided and is an UUID
    if (!req.params.id && isUuid(req.params.id)) {
      return next(new MissingUrlParametersFailure(["id"]));
    }

    // Get potentially existing transaction
    const budget = await prisma.budget.findUnique({
      where: { id: req.params.id },
    });

    // Ensure budget belongs to authenticated user
    if (budget && budget.uid !== req.data.auth.user.id) {
      return next(new BudgetNotFoundFailure());
    }

    // Validate request body
    const body = await validateRequestBody(req, putBudgetSchema);
    if (body.isFailure()) {
      return next(body);
    }

    // Ensure all specified categories exist and are owned by authenticated user
    const categoriesValidityCheck = await BudgetService.ensureValidCategoryIds(
      req.data.auth.user,
      body.value.categoryIds,
      prisma
    );

    if (categoriesValidityCheck.isFailure()) {
      return next(categoriesValidityCheck);
    }

    // If budget exists, delete it
    if (budget) {
      await prisma.budgetCategoryInclusion.deleteMany({
        where: {
          budgetId: budget.id,
        },
      });
      await prisma.budget.delete({
        where: {
          id: budget.id,
        },
      });
    }

    // Create new budget from body (ensure same id)
    const upserted = await prisma.budget.create({
      data: {
        id: req.params.id,
        integerAmount: body.value.integerAmount,
        label: body.value.label,
        User: {
          connect: {
            id: uid,
          },
        },
        BudgetCategoryInclusions: {
          create: body.value.categoryIds.map((id) => {
            return {
              Category: {
                connect: {
                  id,
                },
              },
            };
          }),
        },
      },
      include: {
        BudgetCategoryInclusions: true,
      },
    });

    // Send upserted budget to user
    return res.json(BudgetService.mapBudgetToResponse(upserted));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
