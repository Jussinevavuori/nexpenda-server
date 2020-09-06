import { Request, Response, NextFunction } from "express";
import { Errors } from "../errors/Errors";
import { Failure } from "../utils/Result";

export function handleErrors(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.headersSent) {
    if (error instanceof SyntaxError) {
      return next(
        new Failure(
          Errors.Data.InvalidRequestData({
            _root: error.message,
          })
        )
      );
    }
  }
  next(error);
}
