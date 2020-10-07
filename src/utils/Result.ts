export type Result<T, R = string> = Success<T, R> | Failure<T, R>;

export interface IResult<T, R = string> {
  readonly resultType: "success" | "failure";
  getOr(fallback: T): T;
  isSuccess(): this is Success<T, R>;
  isFailure(): this is Failure<T, R>;
}

/**
 * Success implementation
 */
export class Success<T, C = string> implements IResult<T, C> {
  public readonly resultType: "success" = "success";
  public readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  getOr(fallback: T): T {
    return this.value;
  }

  isSuccess(): this is Success<T, C> {
    return true;
  }

  isFailure(): this is Failure<T, C> {
    return false;
  }

  static Empty() {
    return new Success<void>(undefined);
  }
}

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
  public readonly resultType: "success" = "success";
  public readonly details: FailureDetails<C>;
  public readonly code: C;
  public status: number;
  public message: string;
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

  getOr(fallbackValue: T): T {
    return fallbackValue;
  }

  isSuccess(): this is Success<T, C> {
    return false;
  }

  isFailure(): this is Failure<T, C> {
    return true;
  }

  withMessage(message: string) {
    this.details.message = message;
    this.message = message;
    return this;
  }
}
