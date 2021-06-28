import { stripe } from "../../server";
import { stripeRouter } from "../../routers";
import { CustomerService } from "../../lib/stripe/CustomerService";
import {
  StripeFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { getUrl } from "../../lib/requests/getUrl";

/**
 * Create a stripe billing portal session for managing the user's billing.
 */
stripeRouter.post("/create-billing-portal-session", async (req, res, next) => {
  /**
   * Require authenticated user
   */
  const user = req.data.auth.user;
  if (!user) return next(new UnauthenticatedFailure());

  /**
   * Create or update stripe customer for user
   */
  const customer = await CustomerService.createOrUpdateCustomer(user);

  try {
    /**
     * Create stripe checkout session and return its URL to user
     */
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: getUrl.toFrontend("/app/settings"),
    });

    return res.send({ url: session.url });
  } catch (e) {
    return next(new StripeFailure(e));
  }
});
