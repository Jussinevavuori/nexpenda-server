import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "auth/invalid-credentials",
  status: 400,
  message: "Invalid credentials",
};

export class InvalidCredentialsError extends GenericApplicationError {
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
