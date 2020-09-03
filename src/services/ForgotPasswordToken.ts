import * as yup from "yup";
import * as jwt from "jsonwebtoken";
import { conf } from "../conf";
import { User } from "@prisma/client";
import { AbstractToken } from "./AbstractToken";

type IForgotPasswordToken = {
  uid: string;
};

export class ForgotPasswordToken
  extends AbstractToken<IForgotPasswordToken>
  implements IForgotPasswordToken {
  /**
   * Uid of user who the link is for
   */
  readonly uid: string;

  /**
   * Read raw JWT token to generate new auth link token
   */
  constructor(user: User) {
    super(
      { uid: user.id },
      {
        schema: ForgotPasswordToken.schema,
        tkt: "forgot_password",
        secret: conf.token.forgotPasswordToken.secret,
        expiresIn: conf.token.forgotPasswordToken.expiresIn,
      }
    );
    this.uid = this.payload.uid;
  }

  /**
   * Schema for validating token payloads
   */
  static schema: yup.ObjectSchema<IForgotPasswordToken> = yup
    .object({
      uid: yup.string().required(),
    })
    .required();
}
