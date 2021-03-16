import { profileRouter } from "..";
import { StripeUtils } from "../../services/Stripe";
import { UserService } from "../../services/UserService";
import { UnauthenticatedFailure } from "../../utils/Failures";

profileRouter.get("/", async (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }

  const customer = await StripeUtils.getUserCustomer(req.data.auth.user);
  const subscriptions = customer
    ? await StripeUtils.getSubscriptionsForCustomer(customer.id)
    : undefined;

  return res.json(
    UserService.getPublicProfileDetails(req.data.auth.user, {
      customer,
      subscriptions,
    })
  );
});
