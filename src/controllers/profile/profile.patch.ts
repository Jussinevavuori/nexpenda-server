import { profileRouter } from "..";
import { Schemas } from "../../schemas/Schemas";
import { prisma } from "../../server";
import { UserService } from "../../services/UserService";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { validateRequestBody } from "../../utils/validateRequestBody";

/**
 * Partially update allowed properties in the user's profile.
 */
profileRouter.patch("/", async (req, res, next) => {
  /**
   * Require authentication
   */
  const user = req.data.auth.user;
  if (!user) return next(new UnauthenticatedFailure());

  /**
   * Validate request body
   */
  const body = await validateRequestBody(req, Schemas.Profile.patch);
  if (body.isFailure()) {
    return next(body);
  }

  /**
   * Update profile with provided values
   */
  const updatedProfile = await prisma.profile.update({
    where: { uid: user.id },
    data: {
      displayName: body.value.displayName,
      themeColor: body.value.themeColor,
      themeMode: body.value.themeMode,
    },
  });

  /**
   * Respond with updated auth
   */
  const response = await UserService.createResponse(user, updatedProfile);
  res.json(response);
});
