/**
 * Results are used to provide an error-free development experience. Functions
 * which may fail will return a result, which is either a success containing
 * a value or a failure containing details about the failure.
 *
 * This requires less try-catch blocks and error type parsing from the
 * developer, safer APIs and less unexpected thrown errors.
 *
 * Failures contain standardized details which can be used together with an
 * error handler and a failure handler middleware to communicate useful details
 * about the failures to the client. The client can always trust that any errors
 * will be wrapped as failures and the client may read and use those failures.
 *
 * Take for example a function `getUserData(body: SomeSchema)` which requires a
 * request body to have the correct shape. This can be used in an endpoint
 * as follows.
 *
 * ```
 * router.get("/user-data", (req, res, next) => {
 *
 *   // Automatically validates the body and will not proceed unless the
 *   // body is valid. The failure is automatically sent to error and failure
 *   // handler middleware which will send back a useful error response to
 *   // the client.
 *   const body = validateRequestData(req, someSchema)
 *   if (body.isFailure()) return next(body)
 *
 *   // Similarly, we now know the body contains the value of the correct type
 *   // and we can use it again. Again, this function may fail, upon which event
 *   // we simply pass it on to failure handler middleware and need not worry
 *   // about it.
 *   const userdata = getUserData(body.value)
 *   if (userdata.isFailure()) return next(userdata)
 *
 *   // We will get here safely, without any try-catch blocks and have full
 *   // confidence in our code and error messages.
 *   response.send(userdata)
 * })
 * ```
 */
export type Result<T, R = string> = Success<T, R> | Failure<T, R>;

/**
 * A result, either a success or a failure must implement the following
 * interfaces. They must contain their type (either "success" or "failure"),
 * methods for checking if a result is a success or a failure and a fallback
 * getter which can be used to get the result value or a fallback value in case
 * of a failure.
 */
export interface IResult<T, R = string> {
  readonly resultType: "success" | "failure";
  getOr(fallback: T): T;
  isSuccess(): this is Success<T, R>;
  isFailure(): this is Failure<T, R>;
}

/**
 * Success implementation
 */
export class Success<T, C = any> implements IResult<T, C> {
  /**
   * The result type of a success is always success.
   */
  public readonly resultType: "success";

  /**
   * The value with which the result succeeded.
   */
  public readonly value: T;

  constructor(value: T) {
    this.resultType = "success";
    this.value = value;
  }

  /**
   * A success will return the success value and will not consider the
   * fallback value.
   */
  getOr(fallback: T): T {
    return this.value;
  }

  /**
   * A success is always a success.
   */
  isSuccess(): this is Success<T, C> {
    return true;
  }

  /**
   * A success is never a failure.
   */
  isFailure(): this is Failure<T, C> {
    return false;
  }

  /**
   * Shorthand `Success.Empty()` instead of `new Success<void>(undefined)` for
   * signaling successes which do not contain a value.
   */
  static Empty() {
    return new Success<void>(undefined);
  }
}

/**
 * A failure must always contain an error code (string), a user-readable
 * message, a status code and optionally an errors object which may contain any
 * error data. These are used to communicate failure details to the client when
 * a failure occurs.
 */
type FailureDetails<C = string> = {
  code: C;
  message: string;
  status: number;
  errors?: Partial<Record<string, string>> & {
    _root?: string;
  };
};

/**
 * Failure implementation
 */
export class Failure<T, C = string> implements IResult<T, C> {
  /**
   * A fialure is always a failure.
   */
  public readonly resultType: "failure" = "failure";

  /**
   * Failure details.
   */
  public readonly details: FailureDetails<C>;

  /**
   * Code, destructured from failure details.
   */
  public readonly code: C;

  /**
   * Status code, destructured from failure details.
   */
  public status: number;

  /**
   * User readable failure message, destructured from failure details.
   */
  public message: string;

  /**
   * Optional errors, destructured from failure details.
   */
  public readonly errors?: Partial<Record<string, string>> & {
    _root?: string;
  };

  constructor(details: {
    code: Failure<T, C>["code"];
    message: Failure<T, C>["message"];
    status: Failure<T, C>["status"];
    errors?: Failure<T, C>["errors"];
  }) {
    this.details = details;
    this.code = details.code;
    this.message = details.message;
    this.status = details.status;
    this.errors = details.errors;
  }

  /**
   * A failure will always provide the fallback value as it has no real value.
   */
  getOr(fallbackValue: T): T {
    return fallbackValue;
  }

  /**
   * A failure is never a success.
   */
  isSuccess(): this is Success<T, C> {
    return false;
  }

  /**
   * A failure is always a failure.
   */
  isFailure(): this is Failure<T, C> {
    return true;
  }

  /**
   * Chainable method for updating the failure's message.
   */
  withMessage(message: string) {
    this.details.message = message;
    this.message = message;
    return this;
  }

  /**
   * Chainable method for updating the failure's status code.
   */
  withStatus(status: number) {
    this.details.status = status;
    this.status = status;
    return this;
  }
}
