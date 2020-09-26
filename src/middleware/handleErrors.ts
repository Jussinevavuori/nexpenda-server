import { Request, Response, NextFunction } from "express";
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
        Failure.InvalidRequestData({
          _root: error.message,
        })
      );
    }
  } else {
    return next(
      new Failure<undefined>(undefined, {
        code: error.name,
        message: error.message,
        status: 500,
      })
    );
  }
}
