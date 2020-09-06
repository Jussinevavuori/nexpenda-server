import { AbstractView } from "./ViewTemplate";
import { User } from "@prisma/client";

type ForgotPasswordViewVariables = {
  done?: boolean;
  user?: User;
};

/**
 * Forgot password view wrapper
 */
export class ForgotPasswordView extends AbstractView<
  ForgotPasswordViewVariables
> {
  /**
   * Create new forgot password view
   *
   * If variable done is true, the done screen is rendered
   *
   * If variable user is given, the forgot password screen is rendered
   *
   * If neither is given, invalid or expired token screen is rendered
   */
  constructor(variables: ForgotPasswordViewVariables) {
    super("./forgot_password.ejs", variables);
  }
}
