import { budgetsRouter } from "..";
import { validateRequestBody } from "../../utils/validateRequestBody";
import { prisma } from "../../server";
import {
  DatabaseAccessFailure,
  MissingUrlParametersFailure,
  BudgetNotFoundFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { BudgetMapper } from "../../services/BudgetMapper";
import { anyNonNil as isUuid } from "is-uuid";
import { Permissions } from "../../services/Permissions";
import { BudgetCategoryValidator } from "../../services/BudgetCategoryValidator";
import { Schemas } from "../../schemas/Schemas";

/**
 * Upsert a single budget for the user.
 */
budgetsRouter.put("/:id", async (req, res, next) => {
  try {
    /**
     * Ensure authenticated
     */
    if (!req.data.auth.user) return next(new UnauthenticatedFailure());
    const uid = req.data.auth.user.id;

    /**
     * Ensure query parameter provided and is an UUID
     */
    if (!req.params.id && isUuid(req.params.id)) {
      return next(new MissingUrlParametersFailure(["id"]));
    }

    /**
     * Get potential existing budget for user
     */
    const existingBudget = await prisma.budget.findUnique({
      where: { id: req.params.id },
    });

    /**
     * Ensure potential existing budget belongs to caller
     */
    if (existingBudget && existingBudget.uid !== req.data.auth.user.id) {
      return next(new BudgetNotFoundFailure());
    }

    /**
     * If creating a new budget, ensure the user is allowed to do so
     */
    if (!existingBudget) {
      const permission = await Permissions.getCreateBudgetPermission(
        req.data.auth.user
      );
      if (permission.isFailure()) return next(permission);
    }

    /**
     * Validate request body
     */
    const body = await validateRequestBody(req, Schemas.Budget.put);
    if (body.isFailure()) return next(body);

    /**
     * Ensure all categories are valid and belong to user
     */
    const categoryCheck = await BudgetCategoryValidator.validateCategoryIds(
      req.data.auth.user,
      body.value.categoryIds,
      prisma
    );
    if (categoryCheck.isFailure()) return next(categoryCheck);

    /**
     * If a budget already exists, delete all its data
     */
    if (existingBudget) {
      await prisma.budgetCategoryInclusion.deleteMany({
        where: { budgetId: existingBudget.id },
      });
      await prisma.budget.delete({
        where: { id: existingBudget.id },
      });
    }

    /**
     * Create new budget from body, ensure same ID
     */
    const created = await prisma.budget.create({
      data: {
        id: req.params.id,
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
     * Send created budget to caller
     */
    return res.json(BudgetMapper.mapBudgetToResponse(created));
  } catch (error) {
    return next(new DatabaseAccessFailure(error));
  }
});
