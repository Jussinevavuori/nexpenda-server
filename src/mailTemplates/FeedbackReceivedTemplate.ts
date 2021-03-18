import { AbstractTemplate } from "./AbstractTemplate";

type FeedbackReceivedTemplateVariables = {
  message: string;
  displayName: string;
  email: string;
};

export class FeedbackReceivedTempate extends AbstractTemplate<FeedbackReceivedTemplateVariables> {
  static get templateName() {
    return "template.nexpenda.feedback-received";
  }

  constructor(variables: FeedbackReceivedTemplateVariables) {
    super(variables, {
      templateName: FeedbackReceivedTempate.templateName,
      mailgunTemplateAvailable: true,
    });
  }

  get subject() {
    return `Received feedback from Nexpenda`;
  }

  get text() {
    return `
		${this.vars.message}

		- ${this.vars.displayName} (${this.vars.email})
		`;
  }

  get html() {
    return `
		<p>${this.vars.message}</p>
		<p>- ${this.vars.displayName} (${this.vars.email})</p>
		`;
  }
}
