import { Stripe } from "stripe";
import { conf } from "../conf";
import { prisma } from "../server";

export const stripe = new Stripe(conf.stripe.secretKey, {
  apiVersion: "2020-08-27",
});

export class StripeService {
  /**
   * Creates or updates a customer to the Stripe database. The customer
   * is linked to the user.
   *
   * @param user User to create or update Stripe customer for
   * @returns Updated customer
   */
  static async createOrUpdateCustomer(user: RequestUser) {
    // Check for existing user
    const existing = await StripeService.getUserCustomer(user);

    // Create or update user
    const customer =
      existing && !existing.deleted
        ? await stripe.customers.update(existing.id, {
            name: user.profile.displayName ?? undefined,
            metadata: {
              nexpenda_uid: user.id,
            },
          })
        : await stripe.customers.create({
            email: user.email ?? undefined,
            name: user.profile.displayName ?? undefined,
            metadata: {
              nexpenda_uid: user.id,
            },
          });

    // If new customer ID, update it to DB
    if (customer.id && customer.id !== user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    return customer;
  }

  /**
   * Gets the Stripe customer for the specified user
   *
   * @param user The user for which to fetch the
   */
  static async getUserCustomer(user: RequestUser) {
    try {
      if (!user.stripeCustomerId) return undefined;
      const customer = await stripe.customers.retrieve(user.stripeCustomerId);
      if (customer.deleted) {
        return undefined;
      }
      return customer;
    } catch (e) {
      console.error("Unable to fetch customer", e.name, e.message);
      return undefined;
    }
  }

  /**
   * Retrieves subscriptions for the specified Stripe customer.
   *
   * @param customerId Stripe customer's id
   */
  static async getSubscriptionsForCustomer(customerId?: string | null) {
    if (!customerId) {
      return [];
    }

    const response = await stripe.subscriptions.list({ customer: customerId });
    return response?.data;
  }

  /**
   * Check if a user is actively subscribed
   *
   * @param customerId Customer ID to check for
   */
  static async isPremium(customerId?: string | null): Promise<boolean> {
    if (!customerId) {
      return false;
    }

    const subscriptions = await StripeService.getSubscriptionsForCustomer(
      customerId
    );
    return subscriptions.some((_) => _.status === "active");
  }

  /**
   * Combines products and prices into an easier-to-user format
   * @param products 	List of products
   * @param prices 	 	List of prices
   * @returns        	List of products with each product containing
   * 									a prices field which contains all prices for
   * 									that product.
   */
  static combineProductsAndPrices(
    products: Stripe.Product[],
    prices: Stripe.Price[]
  ): Array<Stripe.Product & { prices: Stripe.Price[] }> {
    return products.map((product) => {
      return {
        ...product,
        prices: prices.filter((price) => {
          return (
            typeof price.product === "string" && price.product === product.id
          );
        }),
      };
    });
  }
}
