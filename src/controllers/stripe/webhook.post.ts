import { Stripe } from "stripe";
import { stripeRouter } from "..";
import { stripe } from "../../server";
import { conf } from "../../conf";
import { isStripeEventType } from "../../lib/stripe/isStripeEventType";
import { StripeInvoiceEventHandler } from "../../lib/stripe/StripeInvoiceEventHandler";
import { PromiseType } from "@prisma/client";

stripeRouter.post("/webhook", async (req, res, next) => {
  /**
   * Get request body and signature. Ensure signature exists
   */
  const requestBody = req.body;
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
      requestBody,
      signature,
      conf.stripe.webhookSecret
    );
  } catch (e) {
    return res.status(400).send(`Event construction failed: ${e.message}`);
  }

  /**
   * Ensure event type is correct
   */
  if (!isStripeEventType(event.type)) {
    return res.status(400).send(`Invalid event type: ${event.type}`);
  }

  /**
   * Respond to stripe with 200
   */
  res.status(200).end();

  /**
   * Pass event to event handlers
   */
  if (StripeInvoiceEventHandler.isEventType(event.type)) {
    await StripeInvoiceEventHandler.handle(event.type, event);
  }
});
