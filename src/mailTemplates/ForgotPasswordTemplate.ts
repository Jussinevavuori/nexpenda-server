import { AbstractTemplate } from "./AbstractTemplate";

type ForgotPasswordTemplateVariables = { url: string; email: string };

export class ForgotPasswordTemplate extends AbstractTemplate<ForgotPasswordTemplateVariables> {
  static get templateName() {
    return "template.expence.forgot-password";
  }

  constructor(variables: ForgotPasswordTemplateVariables) {
    super(variables, {
      templateName: ForgotPasswordTemplate.templateName,
      mailgunTemplateAvailable: true,
    });
  }

  get subject() {
    return `Password reset requested for ${this.vars.email}`;
  }

  get text() {
    return [
      `A password reset was requested for ${this.vars.email}\n`,
      `\n`,
      `Reset your password by clicking on the following link\n`,
      `\n`,
      `${this.vars.url}`,
      `\n`,
      `If you did not request a password reset, you can safely dismiss`,
      `this email.\n`,
    ].join("");
  }

  get html() {
    return `
		<p>Password reset requested for ${this.vars.email}</p>
		<p>Reset your password by clicking on the following link.</p>
		<a href="${this.vars.url}" target="_blank">
			<b>Reset password</b>
		</a>
		<p><i>
		If you did not request a password reset, you can safely dismiss
		this email.
		</i></p>
		`;
  }
}
