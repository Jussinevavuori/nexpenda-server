import { Request, Response, NextFunction } from "express";

export function initializeRequestData() {
  return async function initializeRequestDataMiddleware(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    console.log(`>>>> Data initialized`);
    request.data = {};
    next();
  };
}
