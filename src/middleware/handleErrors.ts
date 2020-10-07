import { Request, Response, NextFunction } from "express";
import { ErrorFailure, InvalidRequestDataFailure } from "../utils/Failures";
import { Failure } from "../utils/Result";

export function handleErrors(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof Failure) {
    return next(error);
  } else if (error instanceof SyntaxError) {
    return next(
      new InvalidRequestDataFailure({
        _root: error.message,
      })
    );
  } else {
    return next(new ErrorFailure(error));
  }
}
