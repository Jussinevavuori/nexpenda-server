import { authRouter } from "..";
import { patchProfileSchema } from "../../schemas/profile.schema";
import { prisma } from "../../server";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { getPublicProfile } from "../../utils/getPublicProfile";
import { validateRequestBody } from "../../utils/validateRequestBody";

authRouter.patch("/profile", async (req, res, next) => {
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
      displayName: body.value.displayName,
    },
  });

  // Respond with updated profile record
  res.json(getPublicProfile(updatedUser));
});