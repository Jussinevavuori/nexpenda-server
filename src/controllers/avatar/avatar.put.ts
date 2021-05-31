import { avatarRouter } from "..";
import { rateLimiters } from "../../middleware/rateLimiters";
import { putAvatarSchema } from "../../schemas/avatar.schema";
import { prisma } from "../../server";
import { AvatarService } from "../../services/AvatarService";
import { UserService } from "../../services/UserService";
import {
  InvalidRequestDataFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { validateRequestBody } from "../../utils/validateRequestBody";

avatarRouter.put("/", rateLimiters.strict(), async (req, res, next) => {
  // Ensure user is authenticated
  const user = req.data.auth.user;
  if (!user) {
    return next(new UnauthenticatedFailure());
  }

  // Validate request body
  const body = await validateRequestBody(req, putAvatarSchema);
  if (body.isFailure()) {
    return next(body);
  }
  const url = body.value.url;

  // Ensure URL is allowed.
  if (!AvatarService.isAllowedDirectPhotoUrl(url)) {
    return next(
      new InvalidRequestDataFailure({
        url: `URL not allowed.`,
      })
    );
  }

  // Update photo URL
  const updatedProfile = await prisma.profile.update({
    where: { uid: user.id },
    data: { photoUrl: url },
  });

  // Respond with updated auth
  const response = await UserService.createResponse(user, updatedProfile);
  res.json(response);
});
