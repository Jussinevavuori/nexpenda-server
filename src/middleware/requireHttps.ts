import { NextFunction, Request, Response } from "express";

export function requireHttps() {
  return function (req: Request, res: Response, next: NextFunction) {
    /**
     * Do not redirect to HTTPS on localhost
     */
    if ((req.headers.host ?? "").match(/localhost/gi)) {
      return next();
    }

    /**
     * Else if not localhost, redirect to HTTPS
     */
    if (!req.secure) {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
  };
}
