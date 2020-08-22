import { authRouter } from "..";
import { tokenService } from "../../services/tokenService";
import { redirect } from "../../utils/redirect";

authRouter.get("/logout", async (request, response) => {
  tokenService.clearRefreshTokenCookie(response);
  redirect(response).toFrontend("/login");
});
