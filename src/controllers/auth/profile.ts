import { authRouter } from "..";
import { UnauthenticatedFailure } from "../../utils/Failures";

authRouter.get("/profile", (req, res, next) => {
  if (!req.data.user) {
    return next(new UnauthenticatedFailure());
  }
  res.json({
    id: req.data.user.id,
    displayName: req.data.user.displayName ?? undefined,
    photoUrl: req.data.user.photoUrl ?? undefined,
    email: req.data.user.email ?? undefined,
    googleId: req.data.user.googleId ?? undefined,
  });
});
