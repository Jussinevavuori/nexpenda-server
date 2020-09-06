import { Request, Response, NextFunction } from "express";
import { Errors } from "../errors/Errors";
import { Failure } from "../utils/Result";

export function requireAuthentication() {
  return async function requireAuthenticationMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.data.user) {
      return next(new Failure(Errors.Auth.Unauthenticated));
    } else {
      return next();
    }
  };
}
