import { z } from "zod";
import { validate } from "./validate";

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
