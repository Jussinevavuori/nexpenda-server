import { z } from "zod";
import { ValidationFailure } from "./Failures";
import { Success } from "./Result";

/**
 * Validate data against a schema and upon failure return the provided
 * default value.
 */
export function validateOr<T extends object>(
  data: any,
  schema: z.Schema<T>,
  defaultValue: T
) {
  const validated = validate(data, schema);
  if (validated.isSuccess()) {
    return validated.value;
  } else {
    return defaultValue;
  }
}

/**
 * Validate data against a schema and return either the parsed / validated
 * value in a success or a validation failure.
 */
export function validate<T extends object>(data: any, schema: z.Schema<T>) {
  const parsed = schema.safeParse(data);

  if (parsed.success) {
    return new Success(parsed.data);
  } else {
    return new ValidationFailure<T>(
      parsed.error.errors.reduce((errors, next) => {
        const path = next.path.join(".");
        const msg = `${next.message} <${next.code}>`;
        return { ...errors, [path]: msg };
      }, {} as Record<string, string>)
    );
  }
}
