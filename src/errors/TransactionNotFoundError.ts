import { GenericApplicationError } from "./GenericApplicationError";

const defaults = {
  code: "transactions/transaction-not-found",
  status: 400,
  message: "Requested transaction not found",
};

export class TransactionNotFoundError extends GenericApplicationError {
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
