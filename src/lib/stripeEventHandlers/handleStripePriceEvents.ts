import { Stripe } from "stripe";
import { ENV } from "../../env";
import { PremiumPriceService } from "../stripe/PremiumPriceService";

function getProductId(price: Stripe.Price) {
  return typeof price.product === "string" ? price.product : price.product.id;
}

/**
 * On `price.created` event upsert new price to database if price is a premium
 * price.
 */
export async function handleStripePriceCreatedEvent(event: Stripe.Event) {
  if (event.type !== "price.created") return;
  const price = event.data.object as Stripe.Price;
  const productId = getProductId(price);
  if (productId === ENV.stripe.premiumProductId) {
    PremiumPriceService.upsertPrice(price);
  }
}

/**
 * On `price.updated` event upsert updated price to database if price is a premium
 * price.
 */
export async function handleStripePriceUpdatedEvent(event: Stripe.Event) {
  if (event.type !== "price.updated") return;
  const price = event.data.object as Stripe.Price;
  const productId = getProductId(price);
  if (productId === ENV.stripe.premiumProductId) {
    PremiumPriceService.upsertPrice(price);
  }
}

/**
 * On `price.deleted` event delete a price from database if price is a premium
 * price.
 */
export async function handleStripePriceDeletedEvent(event: Stripe.Event) {
  if (event.type !== "price.deleted") return;
  const price = event.data.object as Stripe.Price;
  const productId = getProductId(price);
  if (productId === ENV.stripe.premiumProductId) {
    PremiumPriceService.deletePrice(price.id);
  }
}
