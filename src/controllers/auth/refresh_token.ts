import { authRouter } from "..";
import { RefreshToken } from "../../services/RefreshToken";
import { AccessToken } from "../../services/AccessToken";
import { Route } from "../../utils/Route";
import { Errors } from "../../errors/Errors";
import { Failure } from "../../utils/Result";

new Route(authRouter, "/refresh_token").get(async (request, response) => {
  /**
   * Get refresh token and ensure it exists
   */
  const refreshToken = await RefreshToken.fromRequest(request);

  if (!refreshToken) {
    return new Failure(Errors.Auth.Unauthenticated());
  }

  /**
   * Verify refresh token
   */
  const refreshTokenVerified = await refreshToken.verify();

  if (!refreshTokenVerified) {
    return new Failure(Errors.Auth.Unauthenticated());
  }

  /**
   * Create access token
   */
  const accessToken = new AccessToken(refreshToken);

  if (!accessToken) {
    return new Failure(Errors.Auth.Unauthenticated());
  }

  /**
   * Verify created access token
   */
  const accessTokenVerified = await accessToken.verify();

  if (!accessTokenVerified) {
    return new Failure(Errors.Auth.Unauthenticated());
  }

  /**
   * Send access token as string to user
   */
  response.send(accessToken.jwt);
});
