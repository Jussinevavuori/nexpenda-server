import * as z from "zod";
import { ValidationFailure } from "./Failures";
import { Success } from "./Result";

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
