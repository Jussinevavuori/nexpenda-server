import { authRouter } from "..";
import { UserService } from "../../services/UserService";
import { UnauthenticatedFailure } from "../../utils/Failures";

authRouter.get("/profile", (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }

  const userService = new UserService(req.data.auth.user);

  return res.json(userService.getPublicProfileDetails());
});
