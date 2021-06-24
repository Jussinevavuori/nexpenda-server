import { authRouter } from "../../routers";
import { RefreshToken } from "../../lib/tokens/RefreshToken";
import { AccessToken } from "../../lib/tokens/AccessToken";
import {
  InvalidTokenFailure,
  TokenFailure,
  UnauthenticatedFailure,
} from "../../lib/result/Failures";
import { prisma } from "../../server";

/**
 * When a user authenticates, they receive a refresh token in their cookies.
 * They must then periodically request an access token from this endpoint, which
 * should be stored in memory on the client. The refresh token and access token
 * can together be used to authenticate. The access token is shortlived.
 */
authRouter.get("/refresh_token", async (req, res, next) => {
  /**
   * Get refresh token and ensure it exists
   */
  const refreshToken = await RefreshToken.fromRequest(req, prisma);
  if (!refreshToken) {
    return next(new UnauthenticatedFailure());
  }

  /**
   * Verify refresh token
   */
  const refreshTokenVerified = await refreshToken.verify();
  if (!refreshTokenVerified) {
    return next(new UnauthenticatedFailure());
  }

  /**
   * Create access token
   */
  const accessToken = new AccessToken(refreshToken, prisma);
  if (!accessToken) {
    return next(new TokenFailure().withStatus(500));
  }

  /**
   * Verify created access token
   */
  const accessTokenVerified = await accessToken.verify();
  if (!accessTokenVerified) {
    return next(new InvalidTokenFailure().withStatus(500));
  }

  /**
   * Send access token as string to user
   */
  return res.send(accessToken.jwt);
});
