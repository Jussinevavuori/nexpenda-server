import { authRouter } from "..";
import { RefreshToken } from "../../services/RefreshToken";

authRouter.post("/logout", (req, res) => {
  RefreshToken.clearCookie(res).end();
});
