import { conf } from "../conf";
import { Response } from "express";

export function redirect(response: Response) {
  return {
    toFrontend(path: string = "/") {
      if (process.env.NODE_ENV === "test") {
        return response.status(302).end();
      }

      return response.redirect(`${conf.hosts.client}${path}`);
    },
  };
}
