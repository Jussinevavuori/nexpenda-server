import { Request, Response, NextFunction } from "express";
import { GenericApplicationError } from "../errors/GenericApplicationError";
import { UnknownApplicationError } from "../errors/UnknownApplicationError";
import { InvalidRequestDataError } from "../errors/InvalidRequestDataError";

export function handleApplicationError(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let applicationError = error as GenericApplicationError;

  // Automatically handle entity parse failed errors from JSON body parser as invalid request data errors
  if ((error as any).type === "entity.parse.failed") {
    applicationError = new InvalidRequestDataError();
  }

  // Automatically convert all unknown errors to application errors
  else if (!(error instanceof GenericApplicationError)) {
    applicationError = new UnknownApplicationError(
      `${error.name}: ${error.message}`
    );
  }

  // Send error to user
  if (!res.headersSent) {
    res
      .status(applicationError.status)
      .json(applicationError.clientErrorObject);
  } else {
    next(error);
  }
}
