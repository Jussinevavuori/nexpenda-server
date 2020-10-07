import { authRouter } from "..";
import { RefreshToken } from "../../services/RefreshToken";
import { AccessToken } from "../../services/AccessToken";
import { Route } from "../../utils/Route";
import { Failure, Success } from "../../utils/Result";
import { UnauthenticatedFailure } from "../../utils/Failures";

new Route(authRouter, "/refresh_token").get(async (request, response) => {
  /**
   * Get refresh token and ensure it exists
   */
  const refreshToken = await RefreshToken.fromRequest(request);

  if (!refreshToken) {
    return new UnauthenticatedFailure<string>();
  }

  /**
   * Verify refresh token
   */
  const refreshTokenVerified = await refreshToken.verify();

  if (!refreshTokenVerified) {
    return new UnauthenticatedFailure<string>();
  }

  /**
   * Create access token
   */
  const accessToken = new AccessToken(refreshToken);

  if (!accessToken) {
    return new UnauthenticatedFailure<string>();
  }

  /**
   * Verify created access token
   */
  const accessTokenVerified = await accessToken.verify();

  if (!accessTokenVerified) {
    return new UnauthenticatedFailure<string>();
  }

  /**
   * Send access token as string to user
   */
  return new Success(accessToken.jwt);
});
