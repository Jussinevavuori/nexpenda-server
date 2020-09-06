import { DataError } from "./DataError";
import { ApplicationError } from "./ApplicationError";

export type AnyError = ApplicationError | DataError;
