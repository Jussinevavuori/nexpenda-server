import { Stripe } from "stripe";
import { conf } from "../conf";

export const stripe = new Stripe(conf.stripe.secretKey, {
  apiVersion: "2020-08-27",
});

export class StripeUtils {
  static combineProductsAndPrices(
    products: Stripe.Product[],
    prices: Stripe.Price[]
  ) {
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
