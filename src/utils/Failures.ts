import { Failure } from "./Result";

export type ServerFailureCode =
  | "request/invalid-request-data"
  | "transaction/already-exists"
  | "transaction/not-found"
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
  | "failure/unimplemented"
  | "failure/error"
  | "failure/unknown";

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
