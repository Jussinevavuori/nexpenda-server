import { profileRouter } from "..";
import { patchProfileSchema } from "../../schemas/profile.schema";
import { prisma } from "../../server";
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
      displayName: body.value.displayName,
      themeColor: body.value.themeColor,
      themeMode: body.value.themeMode,
    },
  });

  // Respond with updated auth
  const response = await UserService.createResponse(user, updatedProfile);
  res.json(response);
});
