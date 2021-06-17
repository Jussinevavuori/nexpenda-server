import { stripeRouter } from "..";
import { stripe, StripeService } from "../../services/StripeService";
import { StripeFailure } from "../../utils/Failures";

/**
 * Fetch all stripe products.
 */
stripeRouter.get("/products", async (req, res, next) => {
  try {
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
     * Respond with data.
     */
    return res.json(products);
  } catch (e) {
    return new StripeFailure(e);
  }
});
