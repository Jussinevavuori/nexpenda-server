import { Request, Response, NextFunction } from "express";
import { Failure } from "../utils/Result";

export function handleFailure(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`>>>> Handling failures`);
  if (!res.headersSent) {
    console.log(`>>>> Headers not sent`);
    if (error instanceof Failure) {
      console.log(`>>>> Failure recognized`);
      res.send({
        data: error.value,
        message: error.message,
        status: error.status,
        code: error.code,
      });
    }
  }
  console.log(`>>>> Continuing to default error handlers`);
  next(error);
}
