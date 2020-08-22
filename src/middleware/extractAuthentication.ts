import { tokenService } from "../services/tokenService";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../server";

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
    request.user = null;

    /**
     * Verify access token from request
     */
    if (!tokenService.verifyAccessTokenFromRequest(request)) {
      return next();
    }

    /**
     * Verify refresh token from request
     */
    if (!tokenService.verifyRefreshTokenFromRequest(request)) {
      return next();
    }

    /**
     * Get access token from request if all tokens are verified
     */
    const rawAccessToken = tokenService.extractAccessTokenFromRequest(request);
    if (!rawAccessToken) {
      return next();
    }

    /**
     * Parse access token from request and ensure it contains and UID
     */
    const accessToken = tokenService.parseAccessToken(rawAccessToken);
    if (!accessToken || !accessToken.uid) {
      return next();
    }

    /**
     * Get the user by the access token UID and ensure they exist
     */
    const user = await prisma.user.findOne({ where: { id: accessToken.uid } });
    if (!user) {
      return next();
    }

    /**
     * Apply found user to request and continue
     */

    request.user = user;
    next();
  };
}
