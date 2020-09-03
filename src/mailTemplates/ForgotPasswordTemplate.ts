import { AbstractTemplate } from "./AbstractTemplate";

type ForgotPasswordTemplateVariables = { url: string; email: string };

export class ForgotPasswordTemplate extends AbstractTemplate<
  ForgotPasswordTemplateVariables
> {
  constructor(variables: ForgotPasswordTemplateVariables) {
    super(variables);
  }

  get subject() {
    return `Password reset requested for ${this.variables.email}`;
  }

  get text() {
    return [
      `A password reset was requested for ${this.variables.email}\n`,
      `\n`,
      `Reset your password by clicking on the following link\n`,
      `\n`,
      `${this.variables.url}`,
      `\n`,
      `If you did not request a password reset, you can safely dismiss`,
      `this email.\n`,
    ].join("");
  }

  get html() {
    return `
		<p>Password reset requested for ${this.variables.email}</p>
		<p>Reset your password by clicking on the following link.</p>
		<a href="${this.variables.url}" target="_blank">
			<b>Reset password</b>
		</a>
		<p><i>
		If you did not request a password reset, you can safely dismiss
		this email.
		</i></p>
		`;
  }
}
