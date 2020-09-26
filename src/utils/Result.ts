export type Result<T = undefined, E = undefined> =
  | Success<T, E>
  | Failure<T, E>;

interface IResult<T = undefined, E = undefined> {
  /**
   * The current value, either the success or failure value
   */
  value: T | E;

  /**
   * Currently stored value, whether it is the success value or failure value
   */
  getOr(fallbackValue: T): T;

  /**
   * Check if this ``Result`` is a success
   */
  isSuccess(): this is Success<T, E>;

  /**
   * Check if this ``Result`` is a failure
   */
  isFailure(): this is Failure<T, E>;

  /**
   * If the ``Result`` succeeds, the provided callback function is ran with the
   * success value. This is an alternative to saying
   *
   * ```
   * if (result.isSuccess()) {
   *   callback(result.value)
   * }
   * ```
   */
  onSuccess(callback: (value: T) => void): this;

  /**
   * If the ``Result`` fails, the provided callback function is ran with the
   * failure value. This is an alternative to saying
   *
   * ```
   * if (result.isFailure()) {
   *   callback(result.value)
   * }
   * ```
   */
  onFailure(callback: (value: Failure<T, E>) => void): this;
}

/**
 * Success implementation
 */
export class Success<T = undefined, E = undefined> implements IResult<T, E> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  getOr(fallbackValue: T): T {
    return this.value;
  }

  isSuccess(): this is Success<T, E> {
    return true;
  }

  isFailure(): this is Failure<T, E> {
    return false;
  }

  onSuccess(callback: (value: T) => void): this {
    callback(this.value);
    return this;
  }

  onFailure(callback: (value: Failure<T, E>) => void): this {
    return this;
  }

  static From<R = any, U = any>(value: U) {
    return new Success<U, R>(value);
  }

  static Empty<R = any>() {
    return new Success<undefined, R>(undefined);
  }
}

/**
 * Failure implementation
 */
export class Failure<T = undefined, E = undefined> implements IResult<T, E> {
  /**
   * Detailed information on the failure: Failure message.
   *
   * More human readable message for displaying to the user or
   * for debugging purposes.
   */
  message: string;

  /**
   * Detailed information on the failure: Failure status code.
   * Same as HTTP status code.
   */
  status: number;

  /**
   * Detailed information on the failure: Failure error code.
   *
   * Code defines a stringified code presenting more information on
   * what caused the failure and where it occured.
   */
  code: string;

  /**
   * Details is an object which wraps status, code and message into
   * a signle object.
   */
  details: {
    message: string;
    status: number;
    code: string;
  };

  /**
   * Data if any is given
   */
  value: E;

  constructor(
    /**
     * Failure value.
     */
    value: E,

    /**
     * More specific failure options. If not given, will use
     * default failure options.
     */
    options?: {
      /**
       * Detailed information on the failure: Failure message.
       *
       * More human readable message for displaying to the user or
       * for debugging purposes.
       */

      message?: Failure["message"];

      /**
       * Detailed information on the failure: Failure status code.
       * Same as HTTP status code.
       */
      status?: Failure["status"];

      /**
       * Detailed information on the failure: Failure error code.
       *
       * Code defines a stringified code presenting more information on
       * what caused the failure and where it occured.
       */
      code?: Failure["code"];
    }
  ) {
    this.details = {
      message: options?.message ?? "Unknown failure.",
      status: options?.status ?? 0,
      code: options?.code ?? "failure/unknown",
    };
    this.message = this.details.message;
    this.status = this.details.status;
    this.code = this.details.code;
    this.value = value;
  }

  getOr(fallbackValue: T): T {
    return fallbackValue;
  }

  onSuccess(callback: (value: T) => void): this {
    return this;
  }

  onFailure(callback: (value: Failure<T, E>) => void): this {
    callback(this);
    return this;
  }

  isSuccess(): this is Success<T, E> {
    return false;
  }

  isFailure(): this is Failure<T, E> {
    return true;
  }

  withCode(code: string) {
    return new Failure<T, E>(this.value, {
      status: this.status,
      message: this.message,
      code,
    });
  }

  withStatus(status: number) {
    return new Failure<T, E>(this.value, {
      message: this.message,
      code: this.code,
      status,
    });
  }

  withMessage(message: string) {
    return new Failure<T, E>(this.value, {
      code: this.code,
      status: this.status,
      message,
    });
  }

  // Defining common failure types as static factory methods

  static InvalidRequestData<T = undefined, D extends object = object>(data: D) {
    return new Failure<T, D>(data, {
      code: "data/invalid-request-data",
      status: 400,
      message: "Invalid request data",
    });
  }

  static MissingToken<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "token/missing",
      status: 401,
      message: "Token missing in request",
    });
  }

  static InvalidToken<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "token/invalid",
      status: 400,
      message: "Token invalid",
    });
  }

  static TransactionAlreadyExists<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "transaction/already-exists",
      status: 400,
      message: "Transaction already exists",
    });
  }

  static TransactionNotFound<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "transaction/not-found",
      status: 404,
      message: "Transaction not found",
    });
  }

  static UserHasNoPassword<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "auth/user-has-no-password",
      status: 400,
      message: "User has no password",
    });
  }

  static InvalidCredentials<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "auth/invalid-credentials",
      status: 400,
      message: "Invalid credentials",
    });
  }

  static Unauthenticated<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "auth/unauthenticated",
      status: 401,
      message: "Unauthenticated request",
    });
  }

  static Unauthorized<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "auth/unauthorized",
      status: 401,
      message: "Unauthorized request",
    });
  }

  static UserNotFound<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "auth/user-not-found",
      status: 404,
      message: "User not found",
    });
  }

  static UserAlreadyExists<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "auth/user-already-exists",
      status: 400,
      message: "User already exists",
    });
  }

  static EmailNotConfirmed<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "auth/email-not-confirmed",
      status: 400,
      message: "Email not confirmed",
    });
  }

  static EmailAlreadyConfirmed<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "auth/email-already-confirmed",
      status: 400,
      message: "Email already confirmed",
    });
  }

  static MailError<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "mail/error",
      status: 500,
      message: "Mail error",
    });
  }

  static Unimplemented<T = undefined>() {
    return new Failure<T, undefined>(undefined, {
      code: "failure/unimplemented",
      message: "Unimplemented feature",
      status: 2,
    });
  }

  static Error<T = undefined>(error: Error) {
    return new Failure<T, Error>(error, {
      message: error.message,
      code: `error/${error.name}`,
      status: 1,
    });
  }

  static Unknown<T = undefined>() {
    return new Failure<T, undefined>(undefined);
  }
}
