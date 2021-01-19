import { Request, Response, NextFunction } from "express";
import { DatabaseAccessFailure } from "../utils/Failures";
import { Failure } from "../utils/Result";

export function handleFailure(
  failure: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.headersSent) {
    if (failure instanceof Failure) {
      if (failure instanceof DatabaseAccessFailure) {
        console.log(
          `[HANDLE_FAILURE]:`,
          `Caught database access failure`,
          failure.code,
          failure.error
        );
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
