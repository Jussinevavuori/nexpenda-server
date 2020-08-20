import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "error/unimplemented",
  status: 500,
  message: "Unimplemented",
};

export class UnimplementedError extends GenericApplicationError {
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
