import { pingRouter } from "..";
import { UnauthenticatedFailure } from "../../utils/Failures";

pingRouter.get("/", async (req, res) => {
  res.send("pong");
});

pingRouter.get("/protected", async (req, res, next) => {
  if (!req.data.auth.user) {
    return next(new UnauthenticatedFailure());
  }
  return res.send("pong " + req.data.auth.user.id);
});
