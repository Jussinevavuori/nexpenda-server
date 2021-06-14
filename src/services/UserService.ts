import { Profile, User } from ".prisma/client";
import Stripe from "stripe";
import { StripeService } from "./StripeService";

export class UserService {
  /**
   * Creates an empty details. Defaults some of the
   * fields according to the given user's details.
   *
   * @param user 			User to create empty profile for
   * @param defaults	Overrides for properties
   */
  static getEmptyProfile(
    user: User & { Profile?: Profile | null },
    defaults: Partial<Omit<Profile, "uid">> = {}
  ): Profile {
    return {
      uid: user.id,
      displayName: user?.email ?? null,
      photoUrl: null,
      googlePhotoUrl: null,
      themeColor: null,
      themeMode: null,
      ...defaults,
    };
  }

  /**
   * Convert a user and a profile into a request user object. If a
   * profile is provided, that is always used. Else the user's included
   * profile will be used if it exists. If no profile provided or included
   * in user object, an empty profile for that user is created.
   *
   * @param user		User, with or without profile.
   * @param profile Given profile to override user's profile.
   */
  static createRequestUser(
    user: User & { Profile?: Profile | null },
    profile?: Profile | undefined | null
  ): RequestUser {
    const { Profile: userProfile, ...userWithoutProfile } = user;
    const _profile: Profile =
      profile ?? userProfile ?? UserService.getEmptyProfile(user);
    return { ...userWithoutProfile, profile: _profile };
  }

  /**
   * Return publicly available data of a user, their profile and
   * stripe account. This data can be sent to an authenticated
   * requester.
   *
   * @param user		User and profile
   * @param stripe 	Stripe details
   */
  static getPublicProfileDetails(
    user: RequestUser,
    stripe: {
      customer?: Stripe.Customer;
      subscriptions?: Stripe.Subscription[];
    } = {}
  ) {
    return {
      id: user.id,
      displayName: user.profile.displayName ?? undefined,
      photoUrl: user.profile.photoUrl ?? undefined,
      googlePhotoUrl: user.profile.googlePhotoUrl ?? undefined,
      email: user.email ?? undefined,
      googleId: user.googleId ?? undefined,
      themeColor: user.profile.themeColor ?? undefined,
      themeMode: user.profile.themeMode ?? undefined,
      isAdmin: user.isAdmin,
      isPremium: stripe.subscriptions?.some((sub) => sub.status === "active"),
      hasPassword: !!user.password,

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
          cancel_at_period_end: sub.cancel_at_period_end,
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

  /**
   * Creates a response user of the provided user and profile objects
   * that can be sent directly to a user in the response object.
   *
   * @param user    User account from request.
   * @param profile Profile, either user's existing profile or updated profile.
   * @returns       Object to return directly to user.
   */
  static async createResponse(
    user: User,
    profile?: Profile | undefined | null
  ) {
    // Ensure request user format with provided profile details.
    const requestUser = UserService.createRequestUser(user, profile);

    // Fetch stripe customer if any
    const customer = await StripeService.getUserCustomer({
      ...user,
      profile: requestUser.profile,
    });

    // Fetch customer's subscriptions
    const subscriptions = customer
      ? await StripeService.getSubscriptionsForCustomer(customer.id)
      : undefined;

    // Return public profile details
    return UserService.getPublicProfileDetails(requestUser, {
      customer,
      subscriptions,
    });
  }
}
