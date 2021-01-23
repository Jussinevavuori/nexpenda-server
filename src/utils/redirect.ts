import { Response } from "express";
import { getUrl } from "./getUrl";

export function redirect(response: Response) {
  return {
    toServer(path: string = "/") {
      return response.redirect(getUrl.toServer(path));
    },

    toFrontend(path: string = "/") {
      if (process.env.NODE_ENV === "test") {
        return response.status(302).end();
      }

      return response.redirect(getUrl.toFrontend(path));
    },
  };
}
