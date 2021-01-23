import { conf } from "../conf";

function removeTrailingSlash(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function removeLeadingSlash(url: string) {
  return url.startsWith("/") ? url.slice(1) : url;
}

export const getUrl = {
  toServer(path: string = "/") {
    return [
      removeTrailingSlash(conf.hosts.server),
      removeLeadingSlash(path),
    ].join("/");
  },
  toFrontend(path: string = "/") {
    return [
      removeTrailingSlash(conf.hosts.client),
      removeLeadingSlash(path),
    ].join("/");
  },
};
