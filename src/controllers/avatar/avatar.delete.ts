import { avatarRouter } from "..";
import { rateLimiters } from "../../middleware/rateLimiters";
import { prisma } from "../../server";
import { UserService } from "../../services/UserService";
import { UnauthenticatedFailure } from "../../utils/Failures";

/**
 * Endpoint to delete an authenticated user's avatar.
 */
avatarRouter.delete("/", rateLimiters.strict(), async (req, res, next) => {
  /**
   * Ensure user is authenticated
   */
  const user = req.data.auth.user;
  if (!user) return next(new UnauthenticatedFailure());

  /**
   * Delete photo URL from user's profile
   */
  const updatedProfile = await prisma.profile.update({
    where: { uid: user.id },
    data: { photoUrl: null },
  });

  /**
   * Respond with updated auth
   */
  const response = await UserService.createResponse(user, updatedProfile);
  res.json(response);
});
