import { Response } from "express";
import { Errors } from "./Errors";
("");

/**
 * Error properties to construct an application error
 */
export type ErrorProperties = {
  code: string;
  status: number;
  message: string;
};

/**
 * Describe an error interface to be used throughout the application. We only
 * handle application errors for ease of use and standard.
 */
export class ApplicationError implements ErrorProperties {
  /**
   * Each error is assigned with a code, that is also the error object's
   * name
   */
  code: string;

  /**
   * Each error is assigned with a status, which will be sent to the user when
   * the error is handled
   */
  status: number;

  /**
   * Each error is assigned with a message, which will be sent to the user when
   * the error is handled
   */
  message: string;

  /**
   * Each error contains a flag that the error is an application error
   */
  isApplicationError: true;

  /**
   * Construct application error from a properties object and a message
   * override if a custom error message is provided upon construction.
   */
  constructor(properties: ErrorProperties, messageOverride?: string) {
    const message = messageOverride ?? properties.message;
    this.code = properties.code;
    this.status = properties.status;
    this.message = message;
    this.isApplicationError = true;
  }

  /**
   * Automatically convert the object to JSON and send it to the user in the
   * provided response object, where the status is automatically set.
   */
  send(response: Response) {
    return response.status(this.status).json({
      code: this.code,
      status: this.status,
      message: this.message,
      isApplicationError: this.isApplicationError,
    });
  }

  /**
   * Convert any error object to an unknown application error object.
   */
  static fromError(e: Error): ApplicationError {
    return Errors.Unknown(JSON.stringify({ name: e.name, message: e.message }));
  }
}
