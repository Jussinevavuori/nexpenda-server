import { ApplicationError, ErrorProperties } from "./ApplicationError";

/**
 * Helper class for data errors: _root is a special value for errors at the
 * object root.
 */
export type DataErrors<T extends object = {}> = Partial<
  Record<keyof T, string>
> & {
  _root?: string;
};

/**
 * Data validation error wrapper for application error. Instead of taking an
 * error mesasage as input, a data error will be given an object, where each
 * field of the object is either an error message for a field with the same
 * name or undefined, if no error exists for the field.
 *
 * We use "_root" as a field name for errors that are caused by the object
 * itself, not by any field inside the object.
 */
export class DataError<T extends object = {}> extends ApplicationError {
  errors: DataErrors<T>;

  constructor(properties: ErrorProperties, errors: DataErrors<T>) {
    super(properties, JSON.stringify(errors));
    this.errors = errors;
  }
}
