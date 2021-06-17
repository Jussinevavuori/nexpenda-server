import { pingRouter } from "..";
import { UnauthenticatedFailure } from "../../utils/Failures";

/**
 * Ping route test
 */
pingRouter.get("/", async (req, res) => {
  res.send("pong");
});

/**
 * Authenticated ping route test
 */
pingRouter.get("/protected", async (req, res, next) => {
  if (!req.data.auth.user) return next(new UnauthenticatedFailure());
  return res.send("pong " + req.data.auth.user.id);
});
