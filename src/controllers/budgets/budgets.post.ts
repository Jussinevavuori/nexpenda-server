import { budgetsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { BudgetMapper } from "../../services/BudgetMapper";
import { Permissions } from "../../services/Permissions";
import { BudgetCategoryValidator } from "../../services/BudgetCategoryValidator";
import { Schemas } from "../../schemas/Schemas";

/**
 * Create a new budget for the user.
 */
budgetsRouter.post("/", async (req, res, next) => {
  try {
    /**
     * Ensure authenticated
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());
    const uid = req.data.auth.user.id;

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Budget.post);
    if (body.isFailure()) return next(body);

    /**
     * Ensure the user is allowed to create budgets
     */
    const permission = await Permissions.getCreateBudgetPermission(
      req.data.auth.user
    );
    if (permission.isFailure()) return next(permission);

    /**
     * Ensure all specified categories exist and are owned by authenticated user
     */
    const categoryCheck = await BudgetCategoryValidator.validateCategoryIds(
      req.data.auth.user,
      body.value.categoryIds,
      prisma
    );
    if (categoryCheck.isFailure()) return next(categoryCheck);

    /**
     * Create new budget from body with category inclusions
     */
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
    return res.status(201).json(BudgetMapper.mapBudgetToResponse(created));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
