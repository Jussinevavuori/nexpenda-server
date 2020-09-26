import { authRouter } from "..";
import { RefreshToken } from "../../services/RefreshToken";
import { AccessToken } from "../../services/AccessToken";
import { Route } from "../../utils/Route";
import { Failure } from "../../utils/Result";

new Route(authRouter, "/refresh_token").get(async (request, response) => {
  /**
   * Get refresh token and ensure it exists
   */
  const refreshToken = await RefreshToken.fromRequest(request);

  if (!refreshToken) {
    return Failure.Unauthenticated();
  }

  /**
   * Verify refresh token
   */
  const refreshTokenVerified = await refreshToken.verify();

  if (!refreshTokenVerified) {
    return Failure.Unauthenticated();
  }

  /**
   * Create access token
   */
  const accessToken = new AccessToken(refreshToken);

  if (!accessToken) {
    return Failure.Unauthenticated();
  }

  /**
   * Verify created access token
   */
  const accessTokenVerified = await accessToken.verify();

  if (!accessTokenVerified) {
    return Failure.Unauthenticated();
  }

  /**
   * Send access token as string to user
   */
  response.send(accessToken.jwt);
});
