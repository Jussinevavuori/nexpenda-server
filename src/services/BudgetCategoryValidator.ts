import { PrismaClient, User } from ".prisma/client";
import {} from "../server";
import { InvalidRequestDataFailure } from "../utils/Failures";
import { Success } from "../utils/Result";

/**
 * The budget category validator is used to validate the category IDs when a
 * user is creating or updating budgets.
 */
export class BudgetCategoryValidator {
  /**
   * Ensure all specified categories exist and are owned by user, else return
   * failure.
   */
  static async validateCategoryIds(
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
}
