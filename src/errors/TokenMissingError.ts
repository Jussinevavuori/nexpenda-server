import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "error/token-missing",
  status: 401,
  message: "Token missing in request",
};

export class TokenMissingError extends GenericApplicationError {
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
