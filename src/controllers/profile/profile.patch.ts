import { profileRouter } from "..";
import { patchProfileSchema } from "../../schemas/profile.schema";
import { prisma } from "../../server";
import { StripeUtils } from "../../services/Stripe";
import { UserService } from "../../services/UserService";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { validateRequestBody } from "../../utils/validateRequestBody";

profileRouter.patch("/", async (req, res, next) => {
  // Get user from request, ensure one exists
  const user = req.data.auth.user;
  if (!user) {
    return next(new UnauthenticatedFailure());
  }

  // Validate request body
  const body = await validateRequestBody(req, patchProfileSchema);
  if (body.isFailure()) {
    return next(body);
  }

  // Update profile record
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      photoUrl: body.value.photoUrl,
      displayName: body.value.displayName,
      themeColor: body.value.themeColor,
      themeMode: body.value.themeMode,
    },
  });

  const customer = await StripeUtils.getUserCustomer(updatedUser);
  const subscriptions = customer
    ? await StripeUtils.getSubscriptionsForCustomer(customer.id)
    : undefined;

  // Respond with updated profile record
  res.json(
    UserService.getPublicProfileDetails(updatedUser, {
      customer,
      subscriptions,
    })
  );
});
