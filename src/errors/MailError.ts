import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "error/mail",
  status: 400,
  message: "Unknown mail error",
};

export class MailError extends GenericApplicationError {
  constructor(messageOverride?: string) {
    super({ ...defaults, message: messageOverride || defaults.message });
  }

  static get code() {
    return defaults.code;
  }

  static get status() {
    return defaults.status;
  }

  static get defaultMessage() {
    return defaults.message;
  }
}
