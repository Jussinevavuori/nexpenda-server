import { Errors } from "../errors/Errors";
import { AnyError } from "../errors/AnyError";

export type Result<T> = Success<T> | Failure<T>;

export class Success<T> {
  readonly value: T;
  constructor(value: T) {
    this.value = value;
  }

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Failure<T> {
    return false;
  }

  static empty() {
    return new Success<void>(undefined);
  }
}

export class Failure<T> {
  readonly value: AnyError;
  constructor(value: AnyError) {
    this.value = value;
  }

  isSuccess(): this is Success<T> {
    return false;
  }

  isFailure(): this is Failure<T> {
    return true;
  }

  static error<T>(errorSelector: (_: typeof Errors) => AnyError) {
    return new Failure<T>(errorSelector(Errors));
  }
}
