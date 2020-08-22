import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";

export function requireAuthentication() {
  return async function requireAuthenticationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.data.user) {
      return next(new UnauthenticatedError());
    } else {
      return next();
    }
  };
}
