import { User } from "@prisma/client";
import Stripe from "stripe";

export class UserService {
  static getPublicProfileDetails(
    user: User,
    stripe: {
      customer?: Stripe.Customer;
      subscriptions?: Stripe.Subscription[];
    } = {}
  ) {
    return {
      id: user.id,
      displayName: user.displayName ?? undefined,
      photoUrl: user.photoUrl ?? undefined,
      email: user.email ?? undefined,
      googleId: user.googleId ?? undefined,
      prefersColorScheme: user.prefersColorScheme ?? undefined,
      isAdmin: user.isAdmin,
      isPremium: stripe.subscriptions?.some((sub) => sub.status === "active"),

      customer: stripe.customer
        ? {
            id: stripe.customer.id,
            object: stripe.customer.object,
          }
        : undefined,
      subscriptions: (stripe.subscriptions ?? [])?.map((sub) => {
        return {
          id: sub.id,
          items: sub.items.data,
          status: sub.status,
          object: sub.object,
          cancel_at: sub.cancel_at,
          canceled_at: sub.canceled_at,
          canceled_at_period_end: sub.cancel_at_period_end,
          collection_method: sub.collection_method,
          created: sub.created,
          current_period_end: sub.current_period_end,
          current_period_start: sub.current_period_start,
          days_until_due: sub.days_until_due,
          discount: sub.discount,
          ended_at: sub.ended_at,
          start_date: sub.start_date,
          metadata: sub.metadata,
        };
      }),
    };
  }
}
