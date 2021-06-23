import { prisma } from "../../server";
import {
  BudgetLimitExceededFailure,
  TransactionLimitExceededFailure,
} from "../result/Failures";
import { Success } from "../result/Result";
import { ConfigurationService } from "../config/ConfigurationService";
import { StripeService } from "../stripe/StripeService";

/**
 * The permissions class provides methods for validating that users have
 * permission to access features or perform actions, mainly restricted as being
 * admin-only, premium-only or partially available features.
 */
export class Permissions {
  /**
   * Ensure the user is allowed to create transactions. The user is allowed to
   * create unlimited transactions as a premium member, else they have a limit.
   * If this limit is exceeded by creating the given amount of transactions,
   * return a failure.
   *
   * @param user				The user
   * @param createCount	The number of transactions that are being created.
   * 										Defaults to one.
   */
  static async getCreateTransactionPermission(
    user: RequestUser,
    createCount: number = 1
  ) {
    // Premium users are always permitted
    const isPremium = await StripeService.isPremium(user.stripeCustomerId);
    if (isPremium) return Success.Empty();

    // Fetch current configuration
    const configuration = await ConfigurationService.getConfiguration();
    const limit = configuration.isSuccess()
      ? configuration.value.freeTransactionsLimit
      : Infinity; // No limit when configuration fails

    // Count user's current transactions
    const currentCount = await prisma.transaction.count({
      where: { uid: user.id },
    });

    // If too many transactions, return failure
    if (currentCount + createCount > limit) {
      return new TransactionLimitExceededFailure();
    }

    return Success.Empty();
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
  static async getCreateBudgetPermission(
    user: RequestUser,
    createCount: number = 1
  ) {
    // Premium users are always permitted
    const isPremium = await StripeService.isPremium(user.stripeCustomerId);
    if (isPremium) return Success.Empty();

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
