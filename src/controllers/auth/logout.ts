import { authRouter } from "..";
import { RefreshToken } from "../../services/RefreshToken";
import { Route } from "../../utils/Route";

new Route(authRouter, "/logout").post(async (request, response) => {
  RefreshToken.clearCookie(response).end();
});
