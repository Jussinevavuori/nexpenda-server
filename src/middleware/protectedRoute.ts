import { Request, Response, NextFunction } from "express";
import { UnauthenticatedError } from "../errors/UnauthenticatedError";
import { User } from "@prisma/client";

export function protectedRoute(
  resolver: (user: User, req: Request, res: Response, next: NextFunction) => any
) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new UnauthenticatedError());
    } else {
      resolver(req.user, req, res, next);
    }
  };
}
