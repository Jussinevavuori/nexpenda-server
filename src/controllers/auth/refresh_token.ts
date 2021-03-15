import { authRouter } from "..";
import { RefreshToken } from "../../services/RefreshToken";
import { AccessToken } from "../../services/AccessToken";
import {
  InvalidTokenFailure,
  TokenFailure,
  UnauthenticatedFailure,
} from "../../utils/Failures";
import { prisma } from "../../server";

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
