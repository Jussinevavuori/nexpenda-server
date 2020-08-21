import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "auth/unauthorized",
  status: 401,
  message: "Unauthorized request to protected resource",
};

export class UnauthorizedError extends GenericApplicationError {
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
