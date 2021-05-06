import { Budget, PrismaClient, User } from ".prisma/client";
import { prisma } from "../server";
import {
  BudgetLimitExceededFailure,
  InvalidRequestDataFailure,
} from "../utils/Failures";
import { Success } from "../utils/Result";
import { ConfigurationService } from "./ConfigurationService";
import { StripeService } from "./StripeService";

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

  /**
   * Ensure the user is allowed to create budgets. The user is allowed to
   * create unlimited budgets as a premium member, else they have a limit.
   * If this limit is exceeded by creating the given amount of budgets,
   * return a failure.
   *
   * @param user				The user
   * @param createCount	The number of budgets that are being created.
   * 										Defaults to one.
   */
  static async ensureCreatePermission(
    user: RequestUser,
    createCount: number = 1
  ) {
    // Premium users are always permitted
    const isPremium = await StripeService.isPremium(user.stripeCustomerId);
    if (isPremium) {
      return Success.Empty();
    }

    // Fetch current configuration
    const configuration = await ConfigurationService.getConfiguration();
    const limit = configuration.isSuccess()
      ? configuration.value.freeTransactionsLimit
      : Infinity; // No limit when configuration fails

    // Count user's current transactions
    const currentCount = await prisma.budget.count({
      where: { uid: user.id },
    });

    // If too many transactions, return failure
    if (currentCount + createCount > limit) {
      return new BudgetLimitExceededFailure();
    }

    return Success.Empty();
  }
}
