import { Application } from "express";

export type ApplicationErrorDefaults = {
  code: string;
  status: number;
  message: string;
};

const genericApplicationErrorDefaults: ApplicationErrorDefaults = {
  code: "error/generic",
  status: 500,
  message: "Generic application error",
};

export class GenericApplicationError extends Error {
  message: string;
  code: string;
  status: number;

  constructor(
    defaults: ApplicationErrorDefaults = genericApplicationErrorDefaults
  ) {
    super(defaults.message);
    this.code = defaults.code;
    this.status = defaults.status;
    this.message = defaults.message;
  }

  get clientErrorObject() {
    return {
      code: this.code,
      status: this.status,
      message: this.message,
    };
  }

  static get code() {
    return genericApplicationErrorDefaults.code;
  }

  static get status() {
    return genericApplicationErrorDefaults.status;
  }

  static get defaultMessage() {
    return genericApplicationErrorDefaults.message;
  }
}
