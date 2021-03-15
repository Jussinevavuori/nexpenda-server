import { Failure } from "./Result";

export type ServerFailureCode =
  | "request/invalid-request-data"
  | "request/too-many-requests"
  | "request/missing-query-parameters"
  | "request/missing-url-parameters"
  | "transaction/already-exists"
  | "transaction/not-found"
  | "budget/already-exists"
  | "budget/not-found"
  | "auth/missing-token"
  | "auth/invalid-token"
  | "auth/user-has-no-password"
  | "auth/invalid-credentials"
  | "auth/unauthenticated"
  | "auth/unauthorized"
  | "auth/user-not-found"
  | "auth/user-already-exists"
  | "auth/email-not-confirmed"
  | "auth/email-already-confirmed"
  | "mail/error"
  | "database/access-failure"
  | "stripe/failure"
  | "failure/validation"
  | "failure/unimplemented"
  | "failure/error"
  | "failure/unknown"
  | "failure/cors";

export class InvalidRequestDataFailure<T> extends Failure<
  T,
  "request/invalid-request-data"
> {
  constructor(errors: Failure<T, "invalid-request-data">["errors"]) {
    super({
      code: "request/invalid-request-data",
      message: "Invalid request data",
      status: 400,
      errors: errors,
    });
  }
}

export class TooManyRequestsFailure<T> extends Failure<
  T,
  "request/too-many-requests"
> {
  constructor() {
    super({
      code: "request/too-many-requests",
      status: 529,
      message: "Too many requests, please try again later.",
    });
  }
}

export class MissingUrlParametersFailure<T> extends Failure<
  T,
  "request/missing-url-parameters"
> {
  public readonly missingValues: string[];

  constructor(missingValues: string[]) {
    super({
      code: "request/missing-url-parameters",
      message: `Missing url parameters: ${missingValues.join(", ")}`,
      status: 400,
      errors: missingValues.reduce(
        (e, v) => ({ ...e, [v]: "missing" }),
        {} as Record<string, string>
      ),
    });
    this.missingValues = missingValues;
  }
}

export class MissingQueryParametersFailure<T> extends Failure<
  T,
  "request/missing-query-parameters"
> {
  public readonly missingValues: string[];

  constructor(missingValues: string[]) {
    super({
      code: "request/missing-query-parameters",
      message: `Missing query parameters: ${missingValues.join(", ")}`,
      status: 400,
      errors: missingValues.reduce(
        (e, v) => ({ ...e, [v]: "missing" }),
        {} as Record<string, string>
      ),
    });
    this.missingValues = missingValues;
  }
}

export class TransactionAlreadyExistsFailure<T> extends Failure<
  T,
  "transaction/already-exists"
> {
  constructor() {
    super({
      code: "transaction/already-exists",
      status: 400,
      message: "Transaction already exists",
    });
  }
}

export class TransactionNotFoundFailure<T> extends Failure<
  T,
  "transaction/not-found"
> {
  constructor() {
    super({
      code: "transaction/not-found",
      status: 404,
      message: "Transaction not found",
    });
  }
}

export class BudgetAlreadyExistsFailure<T> extends Failure<
  T,
  "budget/already-exists"
> {
  constructor() {
    super({
      code: "budget/already-exists",
      status: 400,
      message: "budget already exists",
    });
  }
}

export class BudgetNotFoundFailure<T> extends Failure<T, "budget/not-found"> {
  constructor() {
    super({
      code: "budget/not-found",
      status: 404,
      message: "budget not found",
    });
  }
}

export class MissingTokenFailure<T> extends Failure<T, "auth/missing-token"> {
  constructor() {
    super({
      code: "auth/missing-token",
      status: 401,
      message: "Token is missing in request",
    });
  }
}

export class InvalidTokenFailure<T> extends Failure<T, "auth/invalid-token"> {
  constructor() {
    super({
      code: "auth/invalid-token",
      status: 400,
      message: "Token is invalid",
    });
  }
}

export class TokenFailure<T> extends Failure<T, "auth/token"> {
  constructor() {
    super({
      code: "auth/token",
      status: 400,
      message: "Token failure",
    });
  }
}

export class UserHasNoPasswordFailure<T> extends Failure<
  T,
  "auth/user-has-no-password"
> {
  constructor() {
    super({
      code: "auth/user-has-no-password",
      status: 400,
      message: "User has no password",
    });
  }
}

export class InvalidCredentialsFailure<T> extends Failure<
  T,
  "auth/invalid-credentials"
> {
  constructor() {
    super({
      code: "auth/invalid-credentials",
      status: 400,
      message: "Invalid credentials",
    });
  }
}

export class UnauthenticatedFailure<T> extends Failure<
  T,
  "auth/unauthenticated"
> {
  constructor() {
    super({
      code: "auth/unauthenticated",
      status: 401,
      message: "Unauthenticated request",
    });
  }
}

export class UnauthorizedFailure<T> extends Failure<T, "auth/unauthorized"> {
  constructor() {
    super({
      code: "auth/unauthorized",
      status: 401,
      message: "Unauthorized request",
    });
  }
}

export class UserNotFoundFailure<T> extends Failure<T, "auth/user-not-found"> {
  constructor() {
    super({
      code: "auth/user-not-found",
      status: 404,
      message: "User not found",
    });
  }
}

export class UserAlreadyExistsFailure<T> extends Failure<
  T,
  "auth/user-already-exists"
> {
  constructor() {
    super({
      code: "auth/user-already-exists",
      status: 400,
      message: "User already exists",
    });
  }
}

export class EmailNotConfirmedFailure<T> extends Failure<
  T,
  "auth/email-not-confirmed"
> {
  constructor() {
    super({
      code: "auth/email-not-confirmed",
      status: 400,
      message: "Email not confirmed",
    });
  }
}

export class EmailAlreadyConfirmedFailure<T> extends Failure<
  T,
  "auth/email-already-confirmed"
> {
  constructor() {
    super({
      code: "auth/email-already-confirmed",
      status: 400,
      message: "Email not confirmed",
    });
  }
}

export class MailErrorFailure<T> extends Failure<T, "mail/error"> {
  constructor() {
    super({ code: "mail/error", status: 500, message: "Mail error" });
  }
}

export class DatabaseAccessFailure<T> extends Failure<
  T,
  "database/access-failure"
> {
  public readonly error?: Error;
  constructor(error?: Error) {
    super({
      code: "database/access-failure",
      status: 500,
      message: "Database access failure",
    });
    this.error = error;
  }
}

export class ValidationFailure<T> extends Failure<T, "failure/validation"> {
  constructor(errors: Failure<T, "invalid-request-data">["errors"]) {
    super({
      code: "failure/validation",
      status: 500,
      message: "Unknown validation failure",
      errors: errors,
    });
  }
}
export class UnimplementedFailure<T> extends Failure<
  T,
  "failure/unimplemented"
> {
  constructor() {
    super({
      code: "failure/unimplemented",
      status: 500,
      message: "Unimplemented feature",
    });
  }
}

export class ErrorFailure<T> extends Failure<T, "failure/error"> {
  public readonly error: Error;
  constructor(error: Error) {
    super({
      code: "failure/error",
      message: error.message,
      status: 500,
    });
    this.error = error;
  }
}

export class UnknownFailure<T> extends Failure<T, "failure/unknown"> {
  constructor() {
    super({ code: "failure/unknown", status: 500, message: "Unknown failure" });
  }
}

export class CorsFailure<T> extends Failure<T, "failure/cors"> {
  constructor() {
    super({ code: "failure/cors", status: 400, message: "Cors failure" });
  }
}

export class StripeFailure<T> extends Failure<T, "stripe/failure"> {
  errorName: string;
  constructor(error: Error) {
    super({
      code: "stripe/failure",
      status: 400,
      message: error.message,
    });
    this.errorName = error.name;
  }
}
