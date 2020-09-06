import { Request, Response, NextFunction } from "express";
import { ApplicationError } from "../errors/ApplicationError";

export function handleApplicationError(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.headersSent) {
    if (error instanceof ApplicationError) {
      return error.send(res);
    } else {
      return ApplicationError.fromError(error).send(res);
    }
  }
  next(error);
}
