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
    console.log(`>>>> Extracting authentication`);

    /**
     * Mark user as null initially to signal that this middleware
     * has taken place and no user was found (unless one is found)
     */

    request.data.user = null;

    /**
     * Get both tokens from request
     */

    const accessToken = await AccessToken.fromRequest(request);

    const refreshToken = await RefreshToken.fromRequest(request);

    if (!accessToken || !refreshToken) {
      console.log(`>>>> No authentication`);
      return next();
    }

    /**
     * Check both tokens are verified
     */

    const accessTokenVerified = await accessToken.verify();

    const refreshTokenVerified = await refreshToken.verify();

    if (!accessTokenVerified || !refreshTokenVerified) {
      console.log(`>>>> No authentication`);
      return next();
    }

    /**
     * Get the user by the access token UID and ensure they exist and
     * are not disabled
     */

    const user = await prisma.user.findOne({ where: { id: accessToken.uid } });

    if (!user || user.disabled || !user.emailVerified) {
      console.log(`>>>> No authentication`);
      return next();
    }

    /**
     * Apply found user to request and continue
     */

    request.data.user = user;

    request.data.accessToken = accessToken;

    request.data.refreshToken = refreshToken;

    console.log(`>>>> Authentication extracted`);
    next();
  };
}
