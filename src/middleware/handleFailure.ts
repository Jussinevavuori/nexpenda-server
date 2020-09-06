import { Request, Response, NextFunction } from "express";
import { Failure } from "../utils/Result";

export function handleFailure(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // console.log("Handling failure", error);
  if (!res.headersSent) {
    // console.log("Headers not yet sent");
    if (error instanceof Failure) {
      // console.log("Error is an instance of failure");
      return error.value.send(res);
    }
  }
  next(error);
}
