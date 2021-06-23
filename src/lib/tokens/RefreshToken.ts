import { z } from "zod";
import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import { conf } from "../../conf";
import { AbstractToken } from "./AbstractToken";

type IRefreshToken = z.TypeOf<typeof RefreshToken["schema"]>;

/**
 * Refresh tokens are used together with access tokens for authentication.
 *
 * The refresh token is a persistent cookie which is provided to the user
 * at login with `RefreshToken.sendCookie()` and cleared from the user during
 * logout with `RefreshToken.clearCookie()`.
 *
 * The refresh token can be parsed from the request with the
 * `RefreshToken.fromRequest()` method.
 *
 * The refresh token alone won't allow a user to access any protected APIs.
 * The user is required to fetch and periodically update a shortlived access
 * token from the server, which should be stored in-memory on the client.
 *
 * In order to authenticate, the access token should be sent in the request
 * headers together with the refresh token as a cookie.
 *
 * A refresh token contain's metadata along with the authenticated user's
 * uid and the token version for token invalidation.
 */
export class RefreshToken
  extends AbstractToken<IRefreshToken>
  implements IRefreshToken
{
  /**
   * Uid of user which this refresh token is authenticating
   */
  readonly uid: string;

  /**
   * Token version: if user's token version and token version do not
   * match, token will be denied.
   */
  readonly vrs: number;

  /**
   * Construct a token from a JWT string or for a user
   */
  constructor(arg: User | string, prisma: PrismaClient) {
    super(
      typeof arg === "string" ? arg : { uid: arg.id, vrs: arg.tokenVersion },
      {
        schema: (_) => _.merge(RefreshToken.schema),
        tkt: "refresh",
        secret: conf.token.refreshToken.secret,
        expiresIn: conf.token.refreshToken.expiresIn,
        defaultUponError: { uid: "", vrs: -1 },
        verify: async (payload) => {
          const user = await prisma.user.findUnique({
            where: { id: payload.uid },
          });
          if (!user) return false;
          return user.tokenVersion === payload.vrs;
        },
      }
    );
    this.uid = this.payload.uid;
    this.vrs = this.payload.vrs;
  }

  /**
   * Sends refresh token as cookie in response
   */
  sendCookie(response: Response): Response {
    const secure = !["development", "test"].includes(conf.env);
    return response.cookie(conf.token.refreshToken.name, this.jwt, {
      maxAge: conf.token.refreshToken.expiresInSeconds * 1000,
      httpOnly: true,
      secure,
      sameSite: secure ? "none" : "lax",
    });
  }

  /**
   * The refresh token schema for validating a refresh token upon parsing
   */
  static schema = z.object({
    uid: z.string(),
    vrs: z.number().int(),
  });

  /**
   * Get refresh token from request cookies. Only returns a refresh token if
   * the refresh token is valid and verified.
   */
  static async fromRequest(request: Request, prisma: PrismaClient) {
    if (!request.cookies) return;
    const token = request.cookies[conf.token.refreshToken.name];
    if (typeof token === "string") {
      try {
        const refreshToken = new RefreshToken(token, prisma);
        const isVerified = await refreshToken.verify();
        if (isVerified) {
          return refreshToken;
        }
      } catch (error) {}
    }
  }

  /**
   * Clears the refresh token from a request
   */
  static clearCookie(response: Response) {
    return response.clearCookie(conf.token.refreshToken.name);
  }
}
