import { stripe } from "../../server";
import { stripeRouter } from "../../routers";
import { StripeFailure } from "../../lib/result/Failures";
import { SimpleCache } from "../../lib/utils/SimpleCache";
import { Stripe } from "stripe";

/**
 * Cache the latest fetched products and refetch every ten minutes
 */
const cache = new SimpleCache<StripeProductWithPrices[]>(600_000);

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
    const products = combineProductsAndPrices(
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

/**
 * Combines products and prices into an easier-to-user format
 * @param products 	List of products
 * @param prices 	 	List of prices
 * @returns        	List of products with each product containing
 * 									a prices field which contains all prices for
 * 									that product.
 */
function combineProductsAndPrices(
  products: Stripe.Product[],
  prices: Stripe.Price[]
): StripeProductWithPrices[] {
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
