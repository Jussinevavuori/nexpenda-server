import { z } from "zod";
import { conf } from "../conf";
import { User } from "@prisma/client";
import { AbstractToken } from "./AbstractToken";
import { prisma } from "../server";

type IResetPasswordToken = z.TypeOf<typeof ResetPasswordToken["schema"]>;

/**
 * The reset password email token is sent in a link in an email to a user who
 * has requested a password reset either at login via the forgot password
 * feature or via the change password feature on their profile page. A valid
 * reset password token can be used to change the user's password.
 */
export class ResetPasswordToken
  extends AbstractToken<IResetPasswordToken>
  implements IResetPasswordToken
{
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
        schema: (_) => _.merge(ResetPasswordToken.schema),
        tkt: "reset_password",
        secret: conf.token.resetPasswordToken.secret,
        expiresIn: conf.token.resetPasswordToken.expiresIn,
        defaultUponError: { uid: "", vrs: -1 },
        verify: async (payload) => {
          const user = await prisma.user.findUnique({
            where: { id: payload.uid },
          });
          if (!user) {
            return false;
          }
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
  static schema = z.object({
    uid: z.string(),
    vrs: z.number().int(),
  });
}
