import { stripe } from "../../server";
import { stripeRouter } from "../../routers";
import { StripeService } from "../../lib/stripe/StripeService";
import {
  StripeFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { getUrl } from "../../lib/requests/getUrl";
import { validateRequestBody } from "../../lib/validation/validateRequestBody";
import { Schemas } from "../../lib/schemas/Schemas";

/**
 * Create a stripe checkout session for subscribing to premium.
 */
stripeRouter.post("/create-checkout-session", async (req, res, next) => {
  /**
   * Require authenticated user
   */
  const user = req.data.auth.user;
  if (!user) return next(new UnauthenticatedFailure());

  /**
   * Create or update stripe customer for user
   */
  const customer = await StripeService.createOrUpdateCustomer(user);

  /**
   * Validate request body
   */
  const body = await validateRequestBody(
    req,
    Schemas.Stripe.createCheckoutSession
  );
  if (body.isFailure()) return next(body);

  try {
    /**
     * Create a stripe checkout session
     */
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      allow_promotion_codes: true,

      /**
       * Use existing customer ID if available
       */
      customer: customer.id ?? undefined,

      /**
       * Ordered items
       */
      line_items: [
        {
          price: body.value.priceId,
          quantity: 1,
        },
      ],

      /**
       * Redirection URLs
       */
      success_url: getUrl.toFrontend("/subscribe/success", {
        session_id: `{CHECKOUT_SESSION_ID}`,
      }),
      cancel_url: getUrl.toFrontend("/subscribe/cancel"),
    });

    /**
     * Respond with checkout session ID
     */
    return res.send({ sessionId: session.id });
  } catch (e) {
    return next(new StripeFailure(e));
  }
});
