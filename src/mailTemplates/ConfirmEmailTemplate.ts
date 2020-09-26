import { AbstractTemplate } from "./AbstractTemplate";

type ConfirmEmailTemplateVariables = { url: string; email: string };

export class ConfirmEmailTemplate extends AbstractTemplate<
  ConfirmEmailTemplateVariables
> {
  constructor(variables: ConfirmEmailTemplateVariables) {
    super(variables);
  }

  get subject() {
    return `Expence: Confirm your email address`;
  }

  get text() {
    return [
      `Confirm your email address (${this.variables.email}) `,
      `to start using Expence.\n`,
      `\n`,
      `Confirm your email by clicking on the following link.\n`,
      `\n`,
      `${this.variables.url}`,
      `\n`,
      `If you did not create this account, you can safely ignore`,
      `this email.\n`,
    ].join("");
  }

  get html() {
    return `
		<p>Confirm your email address (${this.variables.email}) to start using Expence.</p>
		<p>Confirm your email by clicking on the following link.</p>
		<a href="${this.variables.url}" target="_blank">
			<b>Confirm email</b>
		</a>
		<p><i>
		If you did not create this account, you can safely ignore
		this email.
		</i></p>
		`;
  }
}