import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { conf } from "../conf";
import { User } from "@prisma/client";

/**
 * Extracting the access token from any request's authorization bearer header
 */
export function extractAccessTokenFromRequest(request: Request) {
  return request.headers.authorization;
}

/**
 * Extracting the refresh token from any request's cookies
 */
export function extractRefreshTokenFromRequest(request: Request) {
  if (!request.cookies) return;
  const refreshToken = request.cookies[conf.token.refreshToken.name];
  return refreshToken;
}

/**
 * Generate an access token from the request after validating the refresh token
 */
export function generateAccessTokenFromRequest(request: Request) {
  // Ensure refresh token is verified
  const refreshTokenIsVerified = verifyRefreshTokenFromRequest(request);
  if (!refreshTokenIsVerified) {
    return;
  }

  // Generate access token from refresh token
  const refreshToken = extractRefreshTokenFromRequest(request);
  if (refreshToken) {
    return generateAccessToken(refreshToken);
  }
}

/**
 * Generate a refresh token from the request and send it as a cookie in the response
 */
export function generateAndSendRefreshTokenAsCookie(
  user: User,
  response: Response
) {
  try {
    const refreshToken = generateRefreshToken(user);
    return response.cookie(conf.token.refreshToken.name, refreshToken, {
      maxAge: conf.token.refreshToken.expiresInSeconds,
    });
  } catch (error) {
    return response;
  }
}

/**
 * Clearing refresh token cookie (essential logout)
 */
export function clearRefreshTokenCookie(response: Response) {
  return response.clearCookie(conf.token.refreshToken.name);
}

/**
 * Generate a refresh token for a user
 */
export function generateRefreshToken(user: User) {
  return jwt.sign({ uid: user.id }, conf.token.refreshToken.secret, {
    expiresIn: conf.token.refreshToken.expiresIn,
    audience: conf.token.audience,
    issuer: conf.token.issuer,
  });
}

/**
 * Generate an access token as a pair for a refresh token
 */
export function generateAccessToken(refreshToken: string) {
  const payload = parseRefreshToken(refreshToken);
  if (payload) {
    return jwt.sign({ uid: payload.uid }, conf.token.accessToken.secret, {
      expiresIn: conf.token.accessToken.expiresIn,
      audience: conf.token.audience,
      issuer: conf.token.issuer,
    });
  }
}

/**
 * Parse access token
 */
export function parseAccessToken(accessToken: string) {
  const payload = jwt.decode(accessToken);
  if (typeof payload !== "object" || payload === null) return;
  if (typeof payload.uid !== "string") return;
  return payload as { [key: string]: any } & { uid: string };
}

/**
 * Parse refresh token
 */
export function parseRefreshToken(refreshToken: string) {
  const payload = jwt.decode(refreshToken);
  if (typeof payload !== "object" || payload === null) return;
  if (typeof payload.uid !== "string") return;
  return payload as { [key: string]: any } & { uid: string };
}

/**
 * Verify an access token from a request's authorization bearer header
 *
 * @returns boolean for whether the access token is valid and verified
 */
export function verifyAccessTokenFromRequest(request: Request) {
  const accessToken = extractAccessTokenFromRequest(request);
  if (!accessToken) return false;
  return verifyAccessToken(accessToken);
}

/**
 * Verify a refresh token from a request's cookies
 *
 * @returns boolean for whether the refresh token is valid and verified
 */
export function verifyRefreshTokenFromRequest(request: Request) {
  const refreshToken = extractRefreshTokenFromRequest(request);
  if (!refreshToken) return false;
  return verifyRefreshToken(refreshToken);
}

/**
 * Function to verify and validate any access token
 */
export function verifyAccessToken(token: string) {
  try {
    const verifiedToken = jwt.verify(token, conf.token.accessToken.secret, {
      audience: conf.token.audience,
      issuer: conf.token.issuer,
    });
    return Boolean(verifiedToken);
  } catch (error) {
    return false;
  }
}

/**
 * Function to verify and validate any reftesh token
 */
export function verifyRefreshToken(token: string) {
  try {
    const verifiedToken = jwt.verify(token, conf.token.refreshToken.secret, {
      audience: conf.token.audience,
      issuer: conf.token.issuer,
    });
    return Boolean(verifiedToken);
  } catch (error) {
    return false;
  }
}

/**
 * Export all functions under one namespace
 */
export const tokenService = {
  extractAccessTokenFromRequest,
  extractRefreshTokenFromRequest,
  generateAndSendRefreshTokenAsCookie,
  clearRefreshTokenCookie,
  generateAccessTokenFromRequest,
  generateRefreshToken,
  generateAccessToken,
  parseAccessToken,
  parseRefreshToken,
  verifyAccessTokenFromRequest,
  verifyRefreshTokenFromRequest,
  verifyAccessToken,
  verifyRefreshToken,
};
