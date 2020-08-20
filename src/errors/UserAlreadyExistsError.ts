import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "auth/user-already-exists",
  status: 400,
  message: "User already exists",
};

export class UserAlreadyExistsError extends GenericApplicationError {
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
