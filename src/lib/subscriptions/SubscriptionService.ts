import { User, UserSubscription } from "@prisma/client";
import { prisma } from "../../server";
import { compareDate } from "../dates/compareDate";

export class SubscriptionService {
  /**
   * Get a user's subscription
   */
  static async getUserSubscription(user: User) {
    return prisma.userSubscription.findUnique({ where: { uid: user.id } });
  }

  /**
   * Check if a subscription is considered active. A subscription is considered
   * active when it exists and has a current period end, which exists and is
   * either today or in the future.
   */
  static async isSubscriptionActive(subscription?: UserSubscription | null) {
    if (!subscription || !subscription.currentPeriodEnd) {
      return false;
    }
    return compareDate(subscription.currentPeriodEnd, ">=", new Date());
  }

  /**
   * Check if user has an active subscription.
   */
  static async hasActiveSubscription(user: User) {
    const subscription = await SubscriptionService.getUserSubscription(user);
    return SubscriptionService.isSubscriptionActive(subscription);
  }
}
