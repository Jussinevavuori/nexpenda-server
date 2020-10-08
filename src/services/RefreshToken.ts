import { Request, Response } from "express";
import { User } from "@prisma/client";
import { conf } from "../conf";
import * as yup from "yup";
import { prisma } from "../server";
import { AbstractToken } from "./AbstractToken";

type IRefreshToken = {
  uid: string;
  vrs: number;
};

export class RefreshToken
  extends AbstractToken<IRefreshToken>
  implements IRefreshToken {
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
  constructor(arg: User | string) {
    super(
      typeof arg === "string" ? arg : { uid: arg.id, vrs: arg.tokenVersion },
      {
        schema: RefreshToken.schema,
        tkt: "refresh",
        secret: conf.token.refreshToken.secret,
        expiresIn: conf.token.refreshToken.expiresIn,
        defaultUponError: { uid: "", vrs: -1 },
        verify: async (payload) => {
          const user = await prisma.user.findOne({
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
  send(response: Response): Response {
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
  static schema: yup.ObjectSchema<IRefreshToken> = yup
    .object({
      uid: yup.string().required(),
      vrs: yup.number().required().integer(),
    })
    .required();

  /**
   * Get refresh token from request cookies. Only returns a refresh token if
   * the refresh token is valid and verified.
   */
  static async fromRequest(request: Request) {
    if (!request.cookies) return;
    const token = request.cookies[conf.token.refreshToken.name];
    if (typeof token === "string") {
      try {
        const refreshToken = new RefreshToken(token);
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
