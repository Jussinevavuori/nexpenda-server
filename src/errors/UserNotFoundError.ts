import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "auth/user-not-found",
  status: 400,
  message: "Requested user not found",
};

export class UserNotFoundError extends GenericApplicationError {
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
