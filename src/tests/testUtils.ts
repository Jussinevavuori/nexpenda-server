import { Response } from "node-fetch";

export const testUtils = {
  parseCookieFromResponse(response: Response, cookieName: string) {
    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) return;
    const cookie = cookies.find((_) => _.startsWith(`${cookieName}=`));
    if (!cookie) return;
    const match = /(rt=)([^;]*)(;.*)/gm.exec(cookie);
    if (!match) return;
    return match[2];
  },
};
