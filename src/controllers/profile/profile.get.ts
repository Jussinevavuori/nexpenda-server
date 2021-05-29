import { profileRouter } from "..";
import { prisma } from "../../server";
import { UserService } from "../../services/UserService";
import { UnauthenticatedFailure } from "../../utils/Failures";

profileRouter.get("/", async (req, res, next) => {
  const user = req.data.auth.user;
  if (!user) {
    return next(new UnauthenticatedFailure());
  }

  const profile = await prisma.profile.findUnique({
    where: { uid: user.id },
  });

  // Respond with auth
  const response = await UserService.createResponse(user, profile);
  res.json(response);
});
