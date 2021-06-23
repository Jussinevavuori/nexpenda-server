import { AbstractTemplate } from "./AbstractTemplate";

/**
 * Feedback received emails require the email and display name of the user who
 * sent the feedback and the feedback message itself.
 */
type FeedbackReceivedTemplateVariables = {
  message: string;
  displayName: string;
  email: string;
};

/**
 * Feedback received emails are used to notify the developer(s) (as specified
 * in the .env file) of new feedbacks that users have left.
 */
export class FeedbackReceivedTempate extends AbstractTemplate<FeedbackReceivedTemplateVariables> {
  /**
   * Mailgun template name
   */
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
