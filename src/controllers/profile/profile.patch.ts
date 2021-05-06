import { profileRouter } from "..";
import { patchProfileSchema } from "../../schemas/profile.schema";
import { prisma } from "../../server";
import { StripeService } from "../../services/StripeService";
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
  const updatedProfile = await prisma.profile.update({
    where: { uid: user.id },
    data: {
      photoUrl: body.value.photoUrl,
      displayName: body.value.displayName,
      themeColor: body.value.themeColor,
      themeMode: body.value.themeMode,
    },
  });

  // Updated user
  const updatedUser = UserService.createRequestUser(user, updatedProfile);

  const customer = await StripeService.getUserCustomer({
    ...user,
    profile: updatedProfile,
  });

  const subscriptions = customer
    ? await StripeService.getSubscriptionsForCustomer(customer.id)
    : undefined;

  // Respond with updated profile record
  res.json(
    UserService.getPublicProfileDetails(updatedUser, {
      customer,
      subscriptions,
    })
  );
});
