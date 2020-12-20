import { authRouter } from "..";
import { rateLimiter } from "../../middleware/RateLimiter";
import { RefreshToken } from "../../services/RefreshToken";

authRouter.post("/logout", (req, res) => {
  RefreshToken.clearCookie(res).end();
});
