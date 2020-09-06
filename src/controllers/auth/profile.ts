import { authRouter } from "..";
import { Route } from "../../utils/Route";

new Route(authRouter, "/profile").protected.get((user, req, res) => {
  res.json({
    id: user.id,
    displayName: user.displayName ?? undefined,
    photoUrl: user.photoUrl ?? undefined,
    email: user.email ?? undefined,
    googleId: user.googleId ?? undefined,
  });
});
