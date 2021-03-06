import { Request } from "express";
import { ENV } from "../../env";
import { z } from "zod";
import { RefreshToken } from "./RefreshToken";
import { AbstractToken } from "./AbstractToken";
import { PrismaClient } from "@prisma/client";

type IAccessToken = z.TypeOf<typeof AccessToken["schema"]>;

/**
 * Access tokens are used together with refresh tokens for authentication.
 *
 * The access token is a short-lived cookie which can be periodically fetched
 * from the server with a valid, long-lived refresh token (stored as a cookie).
 *
 * The access token can be parsed from the request with the
 * `AccessToken.fromRequest()` method.
 *
 * In order to authenticate, the access token should be sent in the request
 * headers together with the refresh token as a cookie.
 *
 * An access token contain's metadata along with the authenticated user's
 * uid and the token version for token invalidation.
 */
export class AccessToken
  extends AbstractToken<IAccessToken>
  implements IAccessToken
{
  /**
   * Uid of user which this access token is authenticating
   */
  readonly uid: string;

  /**
   * Token version: if user's token version and token version do not
   * match, token will be denied.
   */
  readonly vrs: number;

  /**
   * Construct a token from a JWT string
   */
  constructor(arg: RefreshToken | string, prisma: PrismaClient) {
    super(typeof arg === "string" ? arg : { uid: arg.uid, vrs: arg.vrs }, {
      schema: (_) => _.merge(AccessToken.schema),
      tkt: "access",
      secret: ENV.token.accessToken.secret,
      expiresIn: ENV.token.accessToken.expiresIn,
      defaultUponError: { uid: "", vrs: -1 },
      verify: async (payload) => {
        const user = await prisma.user.findUnique({
          where: { id: payload.uid },
        });
        if (!user) return false;
        return user.tokenVersion === payload.vrs;
      },
    });
    this.uid = this.payload.uid;
    this.vrs = this.payload.vrs;
  }

  /**
   * The access token schema for validating a access token upon parsing
   */
  static schema = z.object({
    uid: z.string(),
    vrs: z.number().int(),
  });

  /**
   * Get access token from request bearer authorization. Only returns a access
   * token if the access token is valid and verified.
   */
  static async fromRequest(request: Request, prisma: PrismaClient) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) return;
    if (!authorizationHeader.toLowerCase().startsWith("bearer ")) return;
    const token = authorizationHeader.split(" ")[1];
    try {
      const accessToken = new AccessToken(token, prisma);
      const isVerified = await accessToken.verify();
      if (isVerified) {
        return accessToken;
      }
    } catch (error) {}
  }
}
