import { Stripe } from "stripe";
import { stripeRouter } from "..";
import { stripe, StripeService } from "../../lib/stripe/StripeService";
import { StripeFailure } from "../../lib/result/Failures";
import { SimpleCache } from "../../lib/utils/SimpleCache";

/**
 * Cache the latest fetched products and refetch every ten minutes
 */
const cache = new SimpleCache<
  (Stripe.Product & {
    prices: Stripe.Price[];
  })[]
>(600_000);

/**
 * Fetch all stripe products.
 */
stripeRouter.get("/products", async (req, res, next) => {
  try {
    /**
     * Attempt to respond from cache if a fresh value exists.
     */
    const freshData = cache.getFresh();
    if (freshData) {
      res.json(freshData);
      return;
    }

    /**
     * Get all products and prices and combine them to single object.
     */
    const productsResponse = await stripe.products.list();
    const pricesResponse = await stripe.prices.list();
    const products = StripeService.combineProductsAndPrices(
      productsResponse.data,
      pricesResponse.data
    );

    /**
     * Cache products
     */
    cache.update(products);

    /**
     * Respond with data.
     */
    return res.json(products);
  } catch (e) {
    return new StripeFailure(e);
  }
});
