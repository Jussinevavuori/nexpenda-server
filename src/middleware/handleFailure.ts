import { Request, Response, NextFunction } from "express";
import {
  DatabaseAccessFailure,
  InvalidRequestDataFailure,
  StripeFailure,
} from "../utils/Failures";
import { Failure } from "../utils/Result";

export function handleFailure(
  failure: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.headersSent) {
    if (failure instanceof Failure) {
      // Warn on database access failures
      if (failure instanceof DatabaseAccessFailure) {
        console.warn(
          `[HANDLE_FAILURE]:`,
          `Caught database access failure`,
          failure.code,
          failure.error
        );
      }

      // Warn on stripe failures
      if (failure instanceof StripeFailure) {
        console.warn(`[HANDLE_FAILURE]:`, `Caught stripe failure`, failure);
      }

      return res.status(failure.status).json({
        data: { errors: failure.errors },
        message: failure.message,
        status: failure.status,
        code: failure.code,
      });
    }
  }
  next(failure);
}
