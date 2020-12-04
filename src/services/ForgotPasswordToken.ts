import * as yup from "yup";
import { conf } from "../conf";
import { User } from "@prisma/client";
import { AbstractToken } from "./AbstractToken";
import { prisma } from "../server";

type IForgotPasswordToken = {
  uid: string;
  vrs: number;
};

export class ForgotPasswordToken
  extends AbstractToken<IForgotPasswordToken>
  implements IForgotPasswordToken {
  /**
   * Uid of user who the link is for
   */
  readonly uid: string;

  /**
   * User token version: token only works if user's token
   * version is identical to the token's version. Upon token
   * being used, the user's token version will be incremented
   */
  readonly vrs: number;

  /**
   * Read raw JWT token to generate new auth link token
   */
  constructor(arg: User | string) {
    super(
      typeof arg === "string" ? arg : { uid: arg.id, vrs: arg.tokenVersion },
      {
        schema: ForgotPasswordToken.schema,
        tkt: "forgot_password",
        secret: conf.token.forgotPasswordToken.secret,
        expiresIn: conf.token.forgotPasswordToken.expiresIn,
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
   * Generate a URL for resetting the password
   */
  generateURL() {
    return `${conf.hosts.client}/changePassword/${this.jwt}`;
  }

  /**
   * Schema for validating token payloads
   */
  static schema: yup.ObjectSchema<IForgotPasswordToken> = yup
    .object({
      uid: yup.string().required(),
      vrs: yup.number().required().integer(),
    })
    .required();
}
