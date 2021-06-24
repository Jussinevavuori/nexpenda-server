import { pingRouter } from "../../routers";
import { UnauthenticatedFailure } from "../../lib/result/Failures";

/**
 * Authenticated ping route test
 */
pingRouter.get("/protected", async (req, res, next) => {
  if (!req.data.auth.user) return next(new UnauthenticatedFailure());
  return res.send("pong " + req.data.auth.user.id);
});
