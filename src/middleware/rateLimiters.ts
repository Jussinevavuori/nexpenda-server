import { Request, RequestHandler } from "express";
import * as rateLimit from "express-rate-limit";
import { TooManyRequestsFailure } from "../utils/Failures";

/**
 * Utility function for converting minutes to milliseconds
 */
function minutesToMs(minutes: number) {
  return minutes * 60 * 1000;
}

/**
 * The test rate limiter is an empty middleware which is used instead of
 * the default rate limiters when testing. It effectively disables rate
 * limiting.
 */
const testRateLimiter: RequestHandler = (req, res, next) => next();

/**
 * Utility function for when the rate limit is exceeded. Passes a failure.
 */
const rateLimitExceededHandler: RequestHandler = (req, res, next) => {
  next(new TooManyRequestsFailure());
};

/**
 * Utility function to create a rate limiter. Automatically applies the
 * test rate limiter in test mode.
 */
function createRateLimiter(...args: Parameters<typeof rateLimit>) {
  if (process.env.NODE_ENV === "test") return testRateLimiter;
  return rateLimit(...args);
}

/**
 * The default rate limiter key generator.
 */
function generateKey(request: Request) {
  return `<${request.ip}>${request.method}@${request.path}#general`;
}

/**
 * Application rate limiters
 */
export const rateLimiters = {
  /**
   * The general rate limiter for most endpoints. Allows max 500 requests
   * in a one minute window.
   */
  general() {
    return createRateLimiter({
      keyGenerator: generateKey,
      windowMs: minutesToMs(1),
      max: 500,
      handler: rateLimitExceededHandler,
    });
  },
  /**
   * The strict rate limiter for more vulnerable endpoints. Allows max 5
   * requests in a five minute window.
   */
  strict() {
    return createRateLimiter({
      keyGenerator: generateKey,
      windowMs: minutesToMs(5),
      max: 5,
      handler: rateLimitExceededHandler,
    });
  },
} as const;
