import { stripeRouter } from "..";
import { stripe, StripeService } from "../../services/StripeService";
import { StripeFailure } from "../../utils/Failures";

stripeRouter.get("/products", async (req, res, next) => {
  try {
    const productsResponse = await stripe.products.list();
    const pricesResponse = await stripe.prices.list();

    const products = StripeService.combineProductsAndPrices(
      productsResponse.data,
      pricesResponse.data
    );

    return res.json(products);
  } catch (e) {
    return new StripeFailure(e);
  }
});
