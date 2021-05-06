import { profileRouter } from "..";
import { StripeService } from "../../services/StripeService";
import { UserService } from "../../services/UserService";
import { UnauthenticatedFailure } from "../../utils/Failures";

profileRouter.get("/", async (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }

  const customer = await StripeService.getUserCustomer(req.data.auth.user);
  const subscriptions = customer
    ? await StripeService.getSubscriptionsForCustomer(customer.id)
    : undefined;

  return res.json(
    UserService.getPublicProfileDetails(req.data.auth.user, {
      customer,
      subscriptions,
    })
  );
});
