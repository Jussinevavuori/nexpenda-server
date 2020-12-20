import { authRouter } from "..";
import { UnauthenticatedFailure } from "../../utils/Failures";
import { getPublicProfile } from "../../utils/getPublicProfile";

authRouter.get("/profile", (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }
  res.json(getPublicProfile(req.data.auth.user));
});
