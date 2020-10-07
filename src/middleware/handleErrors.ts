import { Request, Response, NextFunction } from "express";
import { ErrorFailure, InvalidRequestDataFailure } from "../utils/Failures";

export function handleErrors(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof SyntaxError) {
    return next(
      new InvalidRequestDataFailure({
        _root: error.message,
      })
    );
  } else {
    return next(new ErrorFailure(error));
  }
}
