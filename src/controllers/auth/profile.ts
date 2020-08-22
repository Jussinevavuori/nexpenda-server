import { authRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";

authRouter.get(
  "/profile",
  protectedRoute((user, req, res, next) => {
    try {
      res.json({
        id: user.id,
        displayName: user.displayName ?? undefined,
        photoUrl: user.photoUrl ?? undefined,
        email: user.email ?? undefined,
        googleId: user.googleId ?? undefined,
      });
    } catch (error) {
      next(error);
    }
  })
);
