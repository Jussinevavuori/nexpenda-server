import { Request, Response, NextFunction } from "express";

/**
 * Initializes the `request.data` property. Assumed to run before any middleware
 * or controllers that attempt to use the custom `request.data` field.
 */
export function initializeRequestData() {
  return async function initializeRequestDataMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    /**
     * Initialize as empty
     */
    request.data = { auth: {} };

    next();
  };
}
