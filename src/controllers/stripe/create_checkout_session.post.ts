import { stripeRouter } from "..";
import { stripe } from "../../services/Stripe";
import { StripeFailure } from "../../utils/Failures";
import { getUrl } from "../../utils/getUrl";

stripeRouter.post("/create-checkout-session", async (req, res, next) => {
  const priceId = req.body.priceId;

  // See https://stripe.com/docs/api/checkout/sessions/create
  // for additional parameters to pass.
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      success_url: getUrl.toFrontend(
        "/subscribe/success?session_id={CHECKOUT_SESSION_ID}"
      ),
      cancel_url: getUrl.toFrontend("/subscribe/canceled"),
    });

    return res.send({ sessionId: session.id });
  } catch (e) {
    return next(new StripeFailure(e));
  }
});
