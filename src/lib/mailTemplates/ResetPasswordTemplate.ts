import { AbstractTemplate } from "./AbstractTemplate";

/**
 * Reset password emails require the user's email and the URL that redirects
 * the user to the password reset page.
 */
type ResetPasswordTemplateVariables = { url: string; email: string };

/**
 * Reset password emails are used for both when the user either forgets or
 * wants to manually reset their password. The link in the email contains a
 * token that can be used to access the password reset page.2
 */
export class ResetPasswordTemplate extends AbstractTemplate<ResetPasswordTemplateVariables> {
  /**
   * Mailgun template name. Here the template was still called the forgot
   * password template, however its name has been updated in other places.
   */
  static get templateName() {
    return "template.nexpenda.forgot-password";
  }

  constructor(variables: ResetPasswordTemplateVariables) {
    super(variables, {
      templateName: ResetPasswordTemplate.templateName,
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
