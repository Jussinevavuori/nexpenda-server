import { pingRouter } from "..";
import { protectedRoute } from "../../middleware/protectedRoute";

pingRouter.get("/", (_request, response) => {
  return response.send("pong");
});

pingRouter.get(
  "/protected",
  protectedRoute((user, _request, response) => {
    return response.send(`pong ${user.id}`);
  })
);
