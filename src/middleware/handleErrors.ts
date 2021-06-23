import { Request, Response, NextFunction } from "express";
import {
  ErrorFailure,
  InvalidRequestDataFailure,
} from "../lib/result/Failures";
import { Failure } from "../lib/result/Result";

/**
 * Error handler middleware which converts all errors to failures before
 * the failure handler middleware.
 */
export function handleErrors(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * Pass failures directly
   */
  if (error instanceof Failure) {
    return next(error);
  }

  /**
   * Handle syntax errors as invalid request data failures
   */
  if (error instanceof SyntaxError) {
    return next(
      new InvalidRequestDataFailure({
        _root: error.message,
      })
    );
  }

  /**
   * Everything else is assumed to be an error and is wrapped in an error
   * failure and passed to failure handler.
   */
  return next(new ErrorFailure(error));
}
