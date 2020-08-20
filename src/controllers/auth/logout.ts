import { authRouter } from "..";
import { tokenService } from "../../services/tokenService";

authRouter.get("/logout", async (req, res) => {
  tokenService.clearRefreshTokenCookie(res).end();
});
