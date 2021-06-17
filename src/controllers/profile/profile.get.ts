import { profileRouter } from "..";
import { prisma } from "../../server";
import { UserService } from "../../services/UserService";
import { UnauthenticatedFailure } from "../../utils/Failures";

/**
 * Get the user's profile and other user details.
 */
profileRouter.get("/", async (req, res, next) => {
  /**
   * Require authentication
   */
  const user = req.data.auth.user;
  if (!user) return next(new UnauthenticatedFailure());

  /**
   * Get user's profile
   */
  const profile = await prisma.profile.findUnique({
    where: { uid: user.id },
  });

  /**
   * Respond with data
   */
  const response = await UserService.createResponse(user, profile);
  res.json(response);
});
