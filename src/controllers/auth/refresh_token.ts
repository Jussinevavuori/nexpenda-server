import { authRouter } from "..";
import { RefreshToken } from "../../services/RefreshToken";
import { AccessToken } from "../../services/AccessToken";
import { Route } from "../../utils/Route";
import { Failure } from "../../utils/Result";

new Route(authRouter, "/refresh_token").get(async (request, response) => {
  console.log(">>>> New refresh token request");

  /**
   * Get refresh token and ensure it exists
   */
  const refreshToken = await RefreshToken.fromRequest(request);

  if (!refreshToken) {
    console.log(">>>> Failing with unauthenticated");
    return Failure.Unauthenticated();
  }

  /**
   * Verify refresh token
   */
  const refreshTokenVerified = await refreshToken.verify();

  if (!refreshTokenVerified) {
    console.log(">>>> Failing with unauthenticated");
    return Failure.Unauthenticated();
  }

  /**
   * Create access token
   */
  const accessToken = new AccessToken(refreshToken);

  if (!accessToken) {
    console.log(">>>> Failing with unauthenticated");
    return Failure.Unauthenticated();
  }

  /**
   * Verify created access token
   */
  const accessTokenVerified = await accessToken.verify();

  if (!accessTokenVerified) {
    console.log(">>>> Failing with unauthenticated");
    return Failure.Unauthenticated();
  }

  /**
   * Send access token as string to user
   */
  console.log(">>>> Succeeding with access token");
  response.send(accessToken.jwt);
});
