import * as multer from "multer";
import { Request, Response, NextFunction } from "express";
import { FileFailure, FileTooLargeFailure } from "../utils/Failures";

export function handleMulterErrors(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  /**
   * If the error is a multer error, cast it to a failure based on its
   * code.
   *
   * @todo Add more codes and failures.
   */
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case "LIMIT_FILE_SIZE":
        next(new FileTooLargeFailure<void>());
        return;
      default:
        next(new FileFailure<void>());
        return;
    }
  }

  next(error);
}
