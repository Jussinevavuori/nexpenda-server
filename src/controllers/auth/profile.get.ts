import { authRouter } from "..";
import { UserService } from "../../services/UserService";
import { UnauthenticatedFailure } from "../../utils/Failures";

authRouter.get("/profile", (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }

  return res.json(UserService.getPublicProfileDetails(req.data.auth.user));
});
