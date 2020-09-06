import { pingRouter } from "..";
import { Route } from "../../utils/Route";

new Route(pingRouter, "/").get((_, res) => {
  res.send("pong");
});

new Route(pingRouter, "/protected").protected.get((user, __, res) => {
  res.send("pong " + user.id);
});
