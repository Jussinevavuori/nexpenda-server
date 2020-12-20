import { authRouter } from "..";
import { rateLimiters } from "../../middleware/rateLimiters";
import { RefreshToken } from "../../services/RefreshToken";

authRouter.post("/logout", (req, res) => {
  RefreshToken.clearCookie(res).end();
});
