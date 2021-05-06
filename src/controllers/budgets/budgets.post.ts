import { budgetsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { postBudgetSchema } from "../../schemas/budget.schema";
import { BudgetService } from "../../services/BudgetService";

budgetsRouter.post("/", async (req, res, next) => {
  try {
    // Ensure authenticated
    if (!req.data.auth.user) {
      return next(new UnauthenticatedFailure());
    }
    const uid = req.data.auth.user.id;

    // Validate request body
    const body = await validateRequestBody(req, postBudgetSchema);
    if (body.isFailure()) {
      return next(body);
    }

    // Ensure the user is allowed to create the requested transactions
    const createPermission = await BudgetService.ensureCreatePermission(
      req.data.auth.user
    );
    if (createPermission.isFailure()) {
      return next(createPermission);
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

    // Create new budget from body
    const created = await prisma.budget.create({
      data: {
        integerAmount: body.value.integerAmount,
        label: body.value.label,
        periodMonths: body.value.periodMonths,
        User: { connect: { id: uid } },
        BudgetCategoryInclusions: {
          create: body.value.categoryIds.map((id) => ({
            Category: { connect: { id } },
          })),
        },
      },
      include: { BudgetCategoryInclusions: true },
    });

    /**
     * Send created budget to user with 201 status
     */
    return res.status(201).json(BudgetService.mapBudgetToResponse(created));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
