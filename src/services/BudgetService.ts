import { Budget, PrismaClient, User } from ".prisma/client";
import { InvalidRequestDataFailure } from "../utils/Failures";
import { Success } from "../utils/Result";

export type BudgetResponseMappable = Budget & {
  BudgetCategoryInclusions: {
    categoryId: string;
    budgetId: string;
  }[];
};

export type BudgetResponse = {
  label?: string | undefined;
  id: string;
  createdAt: number;
  integerAmount: number;
  categoryIds: string[];
  periodMonths: number;
};

export class BudgetService {
  /**
   * Ensure all specified categories exist and are owned by user, else return
   * failure.
   */
  static async ensureValidCategoryIds(
    user: User,
    categoryIds: string[],
    prisma: PrismaClient
  ) {
    for (const categoryId of categoryIds) {
      const category = await prisma.category.findUnique({
        where: {
          unique_uid_id: {
            id: categoryId,
            uid: user.id,
          },
        },
      });

      if (!category) {
        return new InvalidRequestDataFailure<void>({
          categoryIds: "Invalid category IDs specified",
        });
      }
    }

    return Success.Empty();
  }

  static mapBudgetToResponse(Budget: BudgetResponseMappable): BudgetResponse;
  static mapBudgetToResponse(
    Budget: BudgetResponseMappable[]
  ): BudgetResponse[];

  /**
   * Maps a single or multiple budgets to a format which is then sent to
   * the user.
   *
   * @param budget Single budget or an array of budgets.
   */
  static mapBudgetToResponse(
    budget: BudgetResponseMappable | BudgetResponseMappable[]
  ): BudgetResponse | BudgetResponse[] {
    if (Array.isArray(budget)) {
      return budget.map((t) => BudgetService.mapBudgetToResponse(t));
    } else {
      return {
        id: budget.id,
        categoryIds: budget.BudgetCategoryInclusions.map((_) => _.categoryId),
        createdAt: budget.createdAt.getTime(),
        integerAmount: budget.integerAmount,
        label: budget.label ?? undefined,
        periodMonths: budget.periodMonths,
      };
    }
  }
}
