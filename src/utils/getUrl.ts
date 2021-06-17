import { conf } from "../conf";

/**
 * Utility function for removing a trailing slash.
 */
function removeTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Utility function for removing a leading slash.
 */
function removeLeadingSlash(url: string) {
  return url.startsWith("/") ? url.slice(1) : url;
}

/**
 * Utility function for constructing a query string from a query object.
 */
function constructQuery(
  query: { [key: string]: string | undefined } | undefined
) {
  if (!query) return "";
  return (
    "?" +
    Object.entries(query)
      .filter((entry) => !!entry[1])
      .map((entry) => `${entry[0]}=${entry[1]}`)
      .join("&")
  );
}

/**
 * Utility function for getting a URL to the server or to the frontend.
 */
export const getUrl = {
  /**
   * Get a server endpoint based on a path and a query.
   */
  toServer(
    path: string = "/",
    query: { [key: string]: string | undefined } = {}
  ) {
    return [
      removeTrailingSlash(conf.hosts.server),
      removeLeadingSlash(path),
      constructQuery(query),
    ].join("/");
  },

  /**
   * Get a client endpoint based on a path and a query.
   */
  toFrontend(
    path: string = "/",
    query: { [key: string]: string | undefined } = {}
  ) {
    return [
      removeTrailingSlash(conf.hosts.client),
      removeLeadingSlash(path),
      constructQuery(query),
    ].join("/");
  },
};
