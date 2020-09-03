import { authRouter } from "..";
import { redirect } from "../../utils/redirect";
import { RefreshToken } from "../../services/RefreshToken";

authRouter.get("/logout", async (request, response) => {
  RefreshToken.clearCookie(response);
  redirect(response).toFrontend("/login");
});
