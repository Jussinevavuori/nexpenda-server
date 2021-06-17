import { Budget } from ".prisma/client";

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

/**
 * The budget mapper is used to map single or multiple budgets into a budget
 * response that can be sent to the caller in the response.
 */
export class BudgetMapper {
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
      return budget.map((t) => BudgetMapper.mapBudgetToResponse(t));
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
