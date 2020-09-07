import { AbstractView } from "./AbstractView";

type ConfirmEmailViewVariables = {
  valid: boolean;
};

/**
 * Forgot password view wrapper
 */
export class ConfirmEmailView extends AbstractView<ConfirmEmailViewVariables> {
  /**
   * Create new confirm email view
   *
   * Takes as input whether the token is valid and the confirmation passed.
   */
  constructor(variables: ConfirmEmailViewVariables) {
    super("confirm_email", variables);
  }
}
