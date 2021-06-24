import { Stripe } from "stripe";
import { stripeRouter } from "../../routers";
import { stripe } from "../../server";
import { conf } from "../../conf";
import {
  handleStripeProductCreatedEvent,
  handleStripeProductDeletedEvent,
  handleStripeProductUpdatedEvent,
} from "../../lib/stripeEventHandlers/handleStripeProductEvents";
import {
  handleStripePriceCreatedEvent,
  handleStripePriceDeletedEvent,
  handleStripePriceUpdatedEvent,
} from "../../lib/stripeEventHandlers/handleStripePriceEvents";

stripeRouter.post("/webhook", async (req, res, next) => {
  /**
   * Get request body and signature. Ensure signature exists
   */
  const signature = req.headers["stripe-signature"];
  if (!signature) {
    return res.status(400).send(`No stripe signature header detected.`);
  }

  /**
   * Attempt constructning webhook event
   */
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      conf.stripe.webhookSecret
    );
  } catch (e) {
    console.log(e);
    return res.status(400).send(`Event construction failed: ${e.message}`);
  }

  /**
   * Respond to stripe with 200
   */
  res.status(200).end();

  console.log("\nWebhook received event:\n\n", event, "\n\n");

  /**
   * Pass event to event handlers
   */
  try {
    switch (event.type) {
      case "product.created":
        return handleStripeProductCreatedEvent(event);
      case "product.updated":
        return handleStripeProductUpdatedEvent(event);
      case "product.deleted":
        return handleStripeProductDeletedEvent(event);
      case "price.created":
        return handleStripePriceCreatedEvent(event);
      case "price.updated":
        return handleStripePriceUpdatedEvent(event);
      case "price.deleted":
        return handleStripePriceDeletedEvent(event);
      default:
        // No event handler specified
        return;
    }
  } catch (e) {
    console.log("Event handling failed", event.type);
  }
});
