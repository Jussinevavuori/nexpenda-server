import { AbstractTemplate } from "./AbstractTemplate";

type PasswordChangedTemplateVariables = { email: string };

export class PasswordChangedTemplate extends AbstractTemplate<PasswordChangedTemplateVariables> {
  static get templateName() {
    return "template.expence.password-changed";
  }

  constructor(variables: PasswordChangedTemplateVariables) {
    super(variables, {
      templateName: PasswordChangedTemplate.templateName,
      mailgunTemplateAvailable: true,
    });
  }

  get subject() {
    return `Password changed for ${this.vars.email}`;
  }

  get text() {
    return `
			The password for the account ${this.vars.email} was changed.

			If you changed the password yourself, you can safely dismiss this email.
			If you did not change the password yourself, your Expence account and / or
			your email account may have been compromised.
		`;
  }

  get html() {
    return `
		<p>The password for the account ${this.vars.email} was changed.</p>
		<p><i>
		If you changed the password yourself, you can safely dismiss this email.
		If you did not change the password yourself, your Expence account and / or
		your email account may have been compromised.
		</i></p>
		`;
  }
}
