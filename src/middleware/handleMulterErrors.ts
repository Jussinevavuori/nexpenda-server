import * as multer from "multer";
import { Request, Response, NextFunction } from "express";
import { FileFailure, FileTooLargeFailure } from "../utils/Failures";

/**
 * Error handler to convert multer errors into failures.
 */
export function handleMulterErrors(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * If the error is a multer error, cast it to a failure based on its
   * code.
   */
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        return next(new FileTooLargeFailure<void>());
      default:
        return next(new FileFailure<void>(error));
    }
  }

  /**
   * By default move error or failure to next error handler.
   */
  return next(error);
}
