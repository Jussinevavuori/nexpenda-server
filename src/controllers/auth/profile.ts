import { authRouter } from "..";
import { UnauthenticatedFailure } from "../../utils/Failures";

authRouter.get("/profile", (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }
  res.json({
    id: req.data.auth.user.id,
    displayName: req.data.auth.user.displayName ?? undefined,
    photoUrl: req.data.auth.user.photoUrl ?? undefined,
    email: req.data.auth.user.email ?? undefined,
    googleId: req.data.auth.user.googleId ?? undefined,
  });
});
