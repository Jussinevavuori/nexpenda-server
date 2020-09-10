import { ApplicationError } from "./ApplicationError";
import { DataError, DataErrors } from "./DataError";

/**
 * All errors constructors will be inside this object
 */
export const Errors = {
  /**
   * Data errors caused by invalid user data
   */
  Data: {
    /**
     * Error for invalid user data
     */
    InvalidRequestData<T extends object = {}>(errors: DataErrors<T>) {
      return new DataError<T>(
        {
          code: "data/invalid-request-data",
          status: 400,
          message: "Invalid request data",
        },
        errors
      );
    },
  },

  /**
   * Errors caused by tokens
   */
  Token: {
    /**
     * Error for when token is missing in request
     */
    Missing(message?: string) {
      return new ApplicationError(
        {
          code: "token/missing",
          status: 401,
          message: "Token missing in request",
        },
        message
      );
    },
    /**
     * Invalid token
     */
    Invalid(message?: string) {
      return new ApplicationError(
        {
          code: "token/invalid",
          status: 400,
          message: "Token invalid",
        },
        message
      );
    },
  },

  /**
   * Errors for the transactions API
   */
  Transaction: {
    /**
     * Transaction already exists
     */
    AlreadyExists(message?: string) {
      return new ApplicationError(
        {
          code: "transaction/already-exists",
          status: 400,
          message: "Transaction already exists",
        },
        message
      );
    },
    /**
     * Transaction not found
     */
    NotFound(message?: string) {
      return new ApplicationError(
        {
          code: "transaction/not-found",
          status: 404,
          message: "Transaction not found",
        },
        message
      );
    },
  },

  /**
   * Errors caused by authentication and authorization exceptions
   */
  Auth: {
    /**
     * User has given invalid credentials
     */
    InvalidCredentials(message?: string) {
      return new ApplicationError(
        {
          code: "auth/invalid-credentials",
          status: 400,
          message: "Invalid credentials",
        },
        message
      );
    },
    /**
     * User is unauthenticated and attempting to access protected resource
     */
    Unauthenticated(message?: string) {
      return new ApplicationError(
        {
          code: "auth/unauthenticated",
          status: 401,
          message: "Unauthenticated request",
        },
        message
      );
    },
    /**
     * User is unauthorized and attempting to access protected resource
     */
    Unauthorized(message?: string) {
      return new ApplicationError(
        {
          code: "auth/unauthorized",
          status: 401,
          message: "Unauthorized request",
        },
        message
      );
    },
    /**
     * User already exists
     */
    UserAlreadyExists(message?: string) {
      return new ApplicationError(
        {
          code: "auth/user-already-exists",
          status: 400,
          message: "User already exists",
        },
        message
      );
    },

    EmailNotConfirmed(message?: string) {
      return new ApplicationError(
        {
          code: "auth/email-not-confirmed",
          status: 400,
          message: "Email not confirmed",
        },
        message
      );
    },

    /**
     * User not found
     */
    UserNotFound(message?: string) {
      return new ApplicationError(
        {
          code: "auth/user-not-found",
          status: 404,
          message: "User not found",
        },
        message
      );
    },
  },

  /**
   * Errors caused by mailers
   */
  Mail: {
    /**
     * Generic mailer errror
     */
    Error(message?: string) {
      return new ApplicationError(
        {
          code: "mail/error",
          status: 500,
          message: "Mail error",
        },
        message
      );
    },
  },

  /**
   * Generic error
   */
  Error(message?: string) {
    return new ApplicationError(
      {
        code: "error/error",
        status: 500,
        message: "Application error",
      },
      message
    );
  },

  /**
   * Unknown error
   */
  Unknown(message?: string) {
    return new ApplicationError(
      {
        code: "error/unknown",
        status: 500,
        message: "Unknown error",
      },
      message
    );
  },

  /**
   * Unimplemented feature error
   */
  Unimplemented(message?: string) {
    return new ApplicationError(
      {
        code: "error/unimplemeted",
        status: 500,
        message: "Unimplemented feature",
      },
      message
    );
  },
} as const;
