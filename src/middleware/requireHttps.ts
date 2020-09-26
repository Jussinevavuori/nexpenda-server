import { NextFunction, Request, Response } from "express";

export function requireHttps(options?: {
  ignoreHosts?: RegExp[];
  ignoreRoutes?: RegExp[];
  redirectCode?: number;
}) {
  const ignoredHosts = options?.ignoreHosts ?? [];
  const ignoredRoutes = options?.ignoreRoutes ?? [];
  const redirectCode = options?.redirectCode ?? 302;

  return function requireHttpsMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const insecure = req.protocol !== "https" && !req.get("x-forwarded-port");

    const ignore =
      ignoredHosts.some((hostRegex) => hostRegex.test(req.get("host") ?? "")) ||
      ignoredRoutes.some((routeRegex) => routeRegex.test(req.path));

    if (insecure && !ignore) {
      return res.redirect(
        redirectCode,
        `https://${req.headers.host}${req.url}`
      );
    }

    return next();
  };
}
