import { AbstractTemplate } from "./AbstractTemplate";

/**
 * Confirm email templates require the confirmation URL and the email of the
 * user whose email is being confirmed.
 */
type ConfirmEmailTemplateVariables = { url: string; email: string };

/**
 * Confirm email template is used for sending email confirmations to users
 * who register or are trying to log in without a confirmed email.
 *
 * The email contains a URL (as `this.vars.url`) which redirects the user
 * to an endpoint which confirms the user's email.
 */
export class ConfirmEmailTemplate extends AbstractTemplate<ConfirmEmailTemplateVariables> {
  /**
   * Mailgun template name.
   */
  static get templateName() {
    return "template.nexpenda.confirm-email";
  }

  constructor(variables: ConfirmEmailTemplateVariables) {
    super(variables, {
      templateName: ConfirmEmailTemplate.templateName,
      mailgunTemplateAvailable: true,
    });
  }

  get subject() {
    return `Nexpenda: Confirm your email address`;
  }

  get text() {
    return [
      `Confirm your email address (${this.vars.email}) `,
      `to start using Nexpenda.\n`,
      `\n`,
      `Confirm your email by clicking on the following link.\n`,
      `\n`,
      `${this.vars.url}`,
      `\n`,
      `If you did not create this account, you can safely ignore`,
      `this email.\n`,
    ].join("");
  }

  get html() {
    return `
		<p>Confirm your email address (${this.vars.email}) to start using Nexpenda.</p>
		<p>Confirm your email by clicking on the following link.</p>
		<a href="${this.vars.url}" target="_blank">
			<b>Confirm email</b>
		</a>
		<p><i>
		If you did not create this account, you can safely ignore
		this email.
		</i></p>
		`;
  }
}
