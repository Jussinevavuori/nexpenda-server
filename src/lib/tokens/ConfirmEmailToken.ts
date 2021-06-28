import { z } from "zod";
import { ENV } from "../../env";
import { User } from "@prisma/client";
import { AbstractToken } from "./AbstractToken";

type IConfirmEmailToken = z.TypeOf<typeof ConfirmEmailToken["schema"]>;

/**
 * The confirm email token is sent in a link in an email to a user who has
 * registered or is attempting to sign in without having confirmed their email.
 * A valid confirm email token can be used to confirm the user's email address.
 */
export class ConfirmEmailToken
  extends AbstractToken<IConfirmEmailToken>
  implements IConfirmEmailToken
{
  /**
   * Uid of user who the link is for
   */
  readonly uid: string;

  /**
   * Read raw JWT token to generate new auth link token
   */
  constructor(arg: string | User) {
    super(typeof arg === "string" ? arg : { uid: arg.id }, {
      schema: (_) => _.merge(ConfirmEmailToken.schema),
      tkt: "confirm_email",
      secret: ENV.token.confirmEmailToken.secret,
      expiresIn: ENV.token.confirmEmailToken.expiresIn,
      defaultUponError: { uid: "" },
    });
    this.uid = this.payload.uid;
  }

  /**
   * Generate a URL for resetting the password
   */
  generateURL() {
    return [ENV.hosts.client, "confirmEmail", this.jwt].join("/");
  }

  /**
   * Schema for validating token payloads
   */
  static schema = z.object({ uid: z.string() });
}
