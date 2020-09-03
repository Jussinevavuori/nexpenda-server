import * as nodemailer from "nodemailer";
import { conf } from "../conf";
import { AbstractTemplate } from "../mailTemplates/AbstractTemplate";

export class Mailer {
  transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: conf.email.host,
      port: conf.email.port,
      secure: false,
      ignoreTLS: true,
      auth: {
        user: conf.email.auth.user,
        pass: conf.email.auth.pass,
      },
    });
  }

  sendTemplate<T extends AbstractTemplate>(to: string, template: T) {
    return this.transporter.sendMail({
      from: conf.email.defaultSender,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  sendMail(options: nodemailer.SendMailOptions) {
    return this.transporter.sendMail(options);
  }
}
