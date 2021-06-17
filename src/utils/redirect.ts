import { Response } from "express";
import { getUrl } from "./getUrl";

/**
 * Utility function for redirecting a response to either a server or a client
 * endpoint.
 */
export function redirect(response: Response) {
  return {
    /**
     * Redirect to a server endpoint.
     */
    toServer(path: string = "/") {
      return response.redirect(getUrl.toServer(path));
    },

    /**
     * Redirect to a client endpoint.
     */
    toFrontend(path: string = "/") {
      /**
       * While testing, do not redirect, only return redirection status.
       */
      if (process.env.NODE_ENV === "test") {
        return response.status(302).end();
      }

      return response.redirect(getUrl.toFrontend(path));
    },
  };
}
