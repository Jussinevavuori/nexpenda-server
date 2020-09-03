import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "token/construction",
  status: 500,
  message: "Could not construct abstract token",
};

export class TokenConstructionError extends GenericApplicationError {
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
