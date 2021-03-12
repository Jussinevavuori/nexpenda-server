import { stripeRouter } from "..";
import { stripe, StripeUtils } from "../../services/Stripe";
import { StripeFailure, UnauthenticatedFailure } from "../../utils/Failures";
import { getUrl } from "../../utils/getUrl";

stripeRouter.post("/create-billing-portal-session", async (req, res, next) => {
  // Require auth
  const user = req.data.auth.user;
  if (!user) {
    return next(new UnauthenticatedFailure());
  }

  // Create or update stripe customer for user
  const customer = await StripeUtils.createOrUpdateCustomer(user);

  try {
    // Create a stripe checkout session
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: getUrl.toFrontend("/app/settings"),
    });

    return res.send({ url: session.url });
  } catch (e) {
    return next(new StripeFailure(e));
  }
});
