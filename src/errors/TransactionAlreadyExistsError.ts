import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "transactions/transaction-already-exists",
  status: 400,
  message: "Transaction already exists",
};

export class TransactionAlreadyExistsError extends GenericApplicationError {
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
