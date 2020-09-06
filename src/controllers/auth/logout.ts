import { authRouter } from "..";
import { redirect } from "../../utils/redirect";
import { RefreshToken } from "../../services/RefreshToken";
import { Route } from "../../utils/Route";

new Route(authRouter, "/logout").get(async (request, response) => {
  /**
   * Clear cookie to log out
   */
  RefreshToken.clearCookie(response);

  /**
   * Redirect to frontend
   */
  redirect(response).toFrontend("/login");
});
