import { Request, Response, NextFunction } from "express";
import { prisma } from "../server";
import { AccessToken } from "../services/AccessToken";
import { RefreshToken } from "../services/RefreshToken";

export function extractAuthentication() {
  return async function extractAuthenticationMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    /**
     * Get access token from request and verify
     */
    const accessToken = await AccessToken.fromRequest(request);

    if (accessToken) {
      request.data.auth.accessTokenFound = true;

      const verified = await accessToken.verify();

      if (verified) {
        request.data.auth.accessToken = accessToken;
      }
    } else {
      request.data.auth.accessTokenFound = false;
    }

    /**
     * Get refresh token from request and verify
     */
    const refreshToken = await RefreshToken.fromRequest(request);

    if (refreshToken) {
      request.data.auth.refreshTokenFound = true;

      const verified = await refreshToken.verify();

      if (verified) {
        request.data.auth.refreshToken = refreshToken;
      }
    } else {
      request.data.auth.refreshTokenFound = false;
    }

    /**
     * Ensure both tokens were found and validated
     */
    if (!request.data.auth.refreshToken || !request.data.auth.accessToken) {
      request.data.auth.noUserReason = "invalid-tokens";
      return next();
    }

    /**
     * Get the user by the access token UID and ensure they exist and
     * are not disabled
     */
    const user = await prisma.user.findUnique({
      where: { id: request.data.auth.accessToken.uid },
    });

    /**
     * Ensure user exists
     */
    if (!user) {
      request.data.auth.noUserReason = "user-not-found";
      return next();
    }

    /**
     * Ensure user not disabled
     */
    if (user.disabled) {
      request.data.auth.blockedUser = user;
      request.data.auth.noUserReason = "disabled";
      return next();
    }

    /**
     * Ensure email is verified
     */
    if (!user.emailVerified) {
      request.data.auth.blockedUser = user;
      request.data.auth.noUserReason = "email-not-verified";
      return next();
    }

    /**
     * Apply found user to request and continue
     */
    request.data.auth.user = user;

    next();
  };
}
