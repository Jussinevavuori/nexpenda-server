import { Request, Response, NextFunction } from "express";
import { DatabaseAccessFailure, StripeFailure } from "../utils/Failures";
import { Failure } from "../utils/Result";

/**
 * Error handler middleware which handles all failures. Assumes an error
 * handler middleware has ran before this middleware and converted all
 * errors into failures.
 */
export function handleFailure(
  failure: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * Pass if response sent
   */
  if (!res.headersSent) {
    /**
     * Act only on failures
     */
    if (failure instanceof Failure) {
      /**
       * Warn on database access failures
       */
      if (failure instanceof DatabaseAccessFailure) {
        console.warn(
          `[HANDLE_FAILURE]:`,
          `Caught database access failure`,
          failure.code,
          failure.error
        );
      }

      /**
       * Warn on stripe failures
       */
      if (failure instanceof StripeFailure) {
        console.warn(`[HANDLE_FAILURE]:`, `Caught stripe failure`, failure);
      }

      /**
       * Respond with standard failure data to frontend
       */
      return res.status(failure.status).json({
        data: { errors: failure.errors },
        message: failure.message,
        status: failure.status,
        code: failure.code,
      });
    }
  }

  /**
   * In case of error pass failure
   */
  next(failure);
}
