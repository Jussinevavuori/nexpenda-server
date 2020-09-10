import * as nodemailer from "nodemailer";
import { conf } from "../conf";
import { AbstractTemplate } from "../mailTemplates/AbstractTemplate";

export class Mailer {
  transporter?: nodemailer.Transporter;

  constructor() {
    try {
      this.transporter = nodemailer.createTransport({
        host: conf.email.host,
        port: conf.email.port,
        pool: true,
        secure: false,
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: conf.email.auth.user,
          pass: conf.email.auth.pass,
        },
      });
    } catch (e) {
      console.error("Error creating mailer transporter", e);
    }
  }

  sendTemplate<T extends AbstractTemplate>(to: string, template: T) {
    return this.sendMail({
      from: conf.email.defaultSender,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  }

  sendMail(options: nodemailer.SendMailOptions) {
    if (process.env.NODE_ENV === "test") {
      return Promise.resolve();
    }
    if (this.transporter) {
      return this.transporter
        .sendMail(options)
        .then(() => {
          console.log("Succesfully sent mail");
        })
        .catch((e) => {
          console.error("Error sending mail", e);
        });
    } else if (process.env.NODE_ENV !== "test") {
      console.warn("Could not send mail due to undefined transporter");
    }
  }
}
