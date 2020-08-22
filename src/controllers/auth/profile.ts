import { authRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";

authRouter.get(
  "/profile",
  protectedRoute((user, req, res, next) => {
    try {
      const { password, ...profile } = user;
      res.json(profile);
    } catch (error) {
      next(error);
    }
  })
);
