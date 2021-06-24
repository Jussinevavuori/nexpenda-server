type StripeProductWithPrices = import("stripe").Stripe.Product & {
  prices: import("stripe").Stripe.Price[];
};
