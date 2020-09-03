import * as nodemailer from "nodemailer";
import { conf } from "../conf";

export class Mailer {
  transporter: nodemailer.Transporter;

  constructor() {
    console.log(conf.email);
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

  sendMail(options: nodemailer.SendMailOptions) {
    return this.transporter.sendMail(options);
  }
}
