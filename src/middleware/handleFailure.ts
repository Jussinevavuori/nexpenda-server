import { Request, Response, NextFunction } from "express";
import { Failure } from "../utils/Result";

export function handleFailure(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!res.headersSent) {
    if (error instanceof Failure) {
      res.send({
        data: error.value,
        message: error.message,
        status: error.status,
        code: error.code,
      });
    }
  }
  next(error);
}
