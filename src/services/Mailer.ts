import * as mailgun from "mailgun-js";
import { conf } from "../conf";
import { AbstractTemplate } from "../mailTemplates/AbstractTemplate";

export class Mailer {
  /**
   * Mailgun instance
   */
  private mg: mailgun.Mailgun;

  /**
   * (In testing mode this should be true). When this flag is set to true, all
   * methods will return early.
   */
  disabled: boolean;

  /**
   * The default sender
   */
  defaultSender: string;

  /**
   * Constructor initializes a mailgun instance.
   */
  constructor() {
    // Disable in testing mode
    if (process.env.NODE_ENV === "test") {
      this.disabled = true;
    }

    this.mg = mailgun({
      apiKey: conf.email.mailgun.apikey,
      domain: conf.email.mailgun.domain,
      host: conf.email.mailgun.host,
    });

    this.disabled = false;

    this.defaultSender = `Nexpenda <${conf.email.defaultSender}>`;
  }

  /**
   * Use the mailer's mailgun instance with a callback function.
   * Returns the result of the callback function or void, if the Mailer was
   * disabled.
   *
   * This was created to disable calling Mailer.mg directly from outside of the
   * class. This way there is no need to write the following every time.
   *
   * ```
   * if (!mailer.disabled) mailer.mailgun.doSomething()
   * ```
   *
   * Instead, you are always be required to use the following version. This
   * avoids sending mail accidentally in testing mode.
   *
   * ```
   * mailer.useMailgun(mg => mg.doSomething())
   * ```
   */
  useMailgun<T>(callback: (mg: mailgun.Mailgun) => T): T | Promise<void> {
    if (this.disabled) return Promise.resolve();
    return callback(this.mg);
  }

  /**
   * Used to send templates to a receiver.
   */
  sendTemplate<T extends AbstractTemplate>(to: string, template: T) {
    if (this.disabled) return Promise.resolve();
    try {
      const body:
        | Partial<mailgun.messages.SendData>
        | Partial<mailgun.messages.BatchData>
        | Partial<mailgun.messages.SendTemplateData> = template.mailgunTemplateAvailable
        ? {
            template: template.templateName,
            "h:X-Mailgun-Variables": JSON.stringify(template.variables),
          }
        : {
            html: template.html,
            text: template.text,
          };

      return this.mg.messages().send(
        {
          from: this.defaultSender,
          to,
          subject: template.subject,
          ...body,
        },
        (error) => {
          if (error) {
            console.error(`Mailgun error`, error);
          }
        }
      );
    } catch (e) {
      console.error(`An error occured in Mailer.sendTemplate`, e);
    }
  }
}
