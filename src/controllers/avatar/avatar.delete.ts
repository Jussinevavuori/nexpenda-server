import { avatarRouter } from "..";
import { prisma } from "../../server";
import { UnauthenticatedFailure } from "../../utils/Failures";

avatarRouter.delete("/", (req, res, next) => {
  // Ensure user is authenticated
  const user = req.data.auth.user;
  if (!user) {
    return next(new UnauthenticatedFailure());
  }

  // Delete photo URL from user's profile
  prisma.profile.update({
    where: { uid: user.id },
    data: { photoUrl: null },
  });

  // End
  return res.end();
});
