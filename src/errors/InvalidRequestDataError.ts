import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "error/invalid-request-data",
  status: 400,
  message: "Invalid request data",
};

export class InvalidRequestDataError extends GenericApplicationError {
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
