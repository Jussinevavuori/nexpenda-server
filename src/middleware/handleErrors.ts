import { Request, Response, NextFunction } from "express";
import { Failure } from "../utils/Result";

export function handleErrors(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log(`>>>> Handling an error: ${error.message}`);
  if (error instanceof SyntaxError) {
    console.log(`>>>> Recognized as a syntax error`);
    return next(
      Failure.InvalidRequestData({
        _root: error.message,
      })
    );
  } else {
    console.log(`>>>> Unknown error`);
    return next(
      new Failure<undefined>(undefined, {
        code: error.name,
        message: error.message,
        status: 500,
      })
    );
  }
}
