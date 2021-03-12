import { conf } from "../conf";

function removeTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function removeLeadingSlash(url: string) {
  return url.startsWith("/") ? url.slice(1) : url;
}

function constructQuery(
  query: { [key: string]: string | undefined } | undefined
) {
  if (!query) return "";
  else return `?${Object.entries(query).map((e) => `${e[0]}=${e[1]}`)}`;
}

export const getUrl = {
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
