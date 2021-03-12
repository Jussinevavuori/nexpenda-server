import { stripeRouter } from "..";
import { stripe, StripeUtils } from "../../services/Stripe";
import {
  InvalidRequestDataFailure,
  StripeFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { getUrl } from "../../utils/getUrl";

stripeRouter.post("/create-checkout-session", async (req, res, next) => {
  // Require auth
  const user = req.data.auth.user;
  if (!user) {
    return next(new UnauthenticatedFailure());
  }

  // Create or update stripe customer for user
  const customer = await StripeUtils.createOrUpdateCustomer(user);

  // Get price id from request and validate it is a string
  const priceId = req.body.priceId;
  if (!priceId) {
    return next(
      new InvalidRequestDataFailure({ priceId: "no priceId provided" })
    );
  } else if (typeof priceId !== "string") {
    return next(
      new InvalidRequestDataFailure({ priceId: "priceId must be a string" })
    );
  }

  try {
    // Create a stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      allow_promotion_codes: true,

      // Use existing stripe customer ID if available
      customer: customer.id ?? undefined,

      line_items: [
        {
          price: priceId,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],

      success_url: getUrl.toFrontend("/subscribe/success", {
        session_id: `{CHECKOUT_SESSION_ID}`,
      }),
      cancel_url: getUrl.toFrontend("/subscribe?canceled=true&"),
    });

    return res.send({ sessionId: session.id });
  } catch (e) {
    return next(new StripeFailure(e));
  }
});
