import { ObjectSchema, ValidationError } from "yup";
import { ValidationFailure } from "./Failures";
import { Success } from "./Result";

export function validate<T extends object>(data: any, schema: ObjectSchema<T>) {
  return schema
    .validate(data, {
      strict: true,
      abortEarly: false,
      stripUnknown: true,
    })
    .then((body) => {
      return new Success(body);
    })
    .catch((error) => {
      // Parse yup validation error fields
      if (error instanceof ValidationError) {
        return new ValidationFailure<T>(
          error.inner.reduce((errors, next) => {
            return { ...errors, [next.path]: next.message };
          }, {})
        );
      } else {
        return new ValidationFailure<T>({
          _root: "Unknown data validation error",
        });
      }
    });
}
