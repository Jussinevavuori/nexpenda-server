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
     * Mark user as null initially to signal that this middleware
     * has taken place and no user was found (unless one is found)
     */
    request.data.user = null;

    /**
     * Get access token from request and verify
     */
    const accessToken = await AccessToken.fromRequest(request);

    if (accessToken) {
      request.data.accessTokenFound = true;

      const verified = await accessToken.verify();

      if (verified) {
        request.data.accessToken = accessToken;
      }
    } else {
      request.data.accessTokenFound = false;
    }

    /**
     * Get refresh token from request and verify
     */
    const refreshToken = await RefreshToken.fromRequest(request);

    if (refreshToken) {
      request.data.refreshTokenFound = true;

      const verified = await refreshToken.verify();

      if (verified) {
        request.data.refreshToken = refreshToken;
      }
    } else {
      request.data.refreshTokenFound = false;
    }

    /**
     * Ensure both tokens were found and validated
     */
    if (!request.data.refreshToken || !request.data.accessToken) {
      request.data.noUserReason = "invalid-tokens";
      return next();
    }

    /**
     * Get the user by the access token UID and ensure they exist and
     * are not disabled
     */
    const user = await prisma.user.findOne({
      where: { id: request.data.accessToken.uid },
    });

    /**
     * Ensure user exists
     */
    if (!user) {
      request.data.noUserReason = "user-not-found";
      return next();
    }

    /**
     * Ensure user not disabled
     */
    if (user.disabled) {
      request.data.blockedUser = user;
      request.data.noUserReason = "disabled";
      return next();
    }

    /**
     * Ensure email is verified
     */
    if (!user.emailVerified) {
      request.data.blockedUser = user;
      request.data.noUserReason = "email-not-verified";
      return next();
    }

    /**
     * Apply found user to request and continue
     */
    request.data.user = user;
    next();
  };
}
