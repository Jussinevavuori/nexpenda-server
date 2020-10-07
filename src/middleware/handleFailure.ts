import { Request, Response, NextFunction } from "express";
import { Failure } from "../utils/Result";

export function handleFailure(
  failure: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.headersSent) {
    if (failure instanceof Failure) {
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
