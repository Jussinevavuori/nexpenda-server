import { authRouter } from "..";
import { UnauthenticatedError } from "../../errors/UnauthenticatedError";
import { RefreshToken } from "../../services/RefreshToken";
import { AccessToken } from "../../services/AccessToken";

authRouter.get("/refresh_token", async (request, response, next) => {
  const refreshToken = await RefreshToken.fromRequest(request);

  if (!refreshToken) {
    return next(new UnauthenticatedError());
  }

  const accessToken = new AccessToken(refreshToken);

  if (!accessToken) {
    return next(new UnauthenticatedError());
  }

  response.send(accessToken.jwt);
});
