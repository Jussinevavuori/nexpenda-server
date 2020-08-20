import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "error/unknown",
  status: 400,
  message: "Unknown application error",
};

export class UnknownApplicationError extends GenericApplicationError {
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
