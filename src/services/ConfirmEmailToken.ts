import * as yup from "yup";
import { conf } from "../conf";
import { User } from "@prisma/client";
import { AbstractToken } from "./AbstractToken";

type IConfirmEmailToken = {
  uid: string;
};

export class ConfirmEmailToken
  extends AbstractToken<IConfirmEmailToken>
  implements IConfirmEmailToken {
  /**
   * Uid of user who the link is for
   */
  readonly uid: string;

  /**
   * Read raw JWT token to generate new auth link token
   */
  constructor(arg: string | User) {
    super(typeof arg === "string" ? arg : { uid: arg.id }, {
      schema: ConfirmEmailToken.schema,
      tkt: "confirm_email",
      secret: conf.token.confirmEmailToken.secret,
      expiresIn: conf.token.confirmEmailToken.expiresIn,
      defaultUponError: { uid: "" },
    });
    this.uid = this.payload.uid;
  }

  /**
   * Generate a URL for resetting the password
   */
  generateURL() {
    return [
      process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "http://expenceapp.herokuapp.com",
      "confirmEmail",
      this.jwt,
    ].join("/");
  }

  /**
   * Schema for validating token payloads
   */
  static schema: yup.ObjectSchema<IConfirmEmailToken> = yup
    .object({
      uid: yup.string().required(),
    })
    .required();
}
