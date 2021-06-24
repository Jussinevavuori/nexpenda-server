import { avatarRouter } from "../../routers";
import { rateLimiters } from "../../middleware/rateLimiters";
import { Schemas } from "../../lib/schemas/Schemas";
import { prisma } from "../../server";
import { AvatarService } from "../../lib/avatars/AvatarService";
import { UserService } from "../../lib/users/UserService";
import {
  InvalidRequestDataFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { validateRequestBody } from "../../lib/validation/validateRequestBody";

/**
 * Endpoint to manually update the authenticated user's avatar URL to any valid
 * image URL. Mainly used for resetting the user's image to their google profile
 * picture URL which is stored in the database.
 */
avatarRouter.put("/", rateLimiters.strict(), async (req, res, next) => {
  /**
   * Ensure user is authenticated
   */
  const user = req.data.auth.user;
  if (!user) return next(new UnauthenticatedFailure());

  /**
   * Validate request body
   */
  const body = await validateRequestBody(req, Schemas.Avatar.put);
  if (body.isFailure()) return next(body);

  /**
   * Ensure URL is an allowed URL
   */
  if (!AvatarService.isAllowedDirectPhotoUrl(body.value.url)) {
    return next(
      new InvalidRequestDataFailure({
        url: `URL not allowed.`,
      })
    );
  }

  /**
   * Update photo URL to profile
   */
  const updatedProfile = await prisma.profile.update({
    where: { uid: user.id },
    data: { photoUrl: body.value.url },
  });

  /**
   * Respond with updated auth
   */
  const response = await UserService.createResponse(user, updatedProfile);
  res.json(response);
});
