import { Request } from "express";
import { conf } from "../conf";
import * as yup from "yup";
import { RefreshToken } from "./RefreshToken";
import { AbstractToken } from "./AbstractToken";
import { prisma } from "../server";

type IAccessToken = {
  uid: string;
  vrs: number;
};

export class AccessToken
  extends AbstractToken<IAccessToken>
  implements IAccessToken {
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
  constructor(arg: RefreshToken | string) {
    super(typeof arg === "string" ? arg : { uid: arg.uid, vrs: arg.vrs }, {
      schema: AccessToken.schema,
      tkt: "access",
      secret: conf.token.accessToken.secret,
      expiresIn: conf.token.accessToken.expiresIn,
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
  static schema: yup.ObjectSchema<IAccessToken> = yup
    .object({
      uid: yup.string().required(),
      vrs: yup.number().required().integer(),
    })
    .required();

  /**
   * Get access token from request cookies. Only returns a access token if
   * the access token is valid and verified.
   */
  static async fromRequest(request: Request) {
    if (!request.cookies) return;
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) return;
    if (!authorizationHeader.toLowerCase().startsWith("bearer ")) return;
    const token = authorizationHeader.split(" ")[1];
    try {
      const accessToken = new AccessToken(token);
      const isVerified = await accessToken.verify();
      if (isVerified) {
        return accessToken;
      }
    } catch (error) {}
  }
}
