import { z } from "zod";
import { Request } from "express";
import { Success } from "../result/Result";
import { InvalidRequestDataFailure } from "../result/Failures";

/**
 * Validates a request body against a schema and provides useful error
 * messages that can be directly sent back to the user in an invalid request
 * data failure. Upon a valid request body, returns the correctly-typed, valid
 * body in a success.
 */
export async function validateRequestBody<T extends object>(
  request: Request,
  schema: z.Schema<T>
) {
  /**
   * Ensure request body is defined
   */
  if (!request.body) {
    return new InvalidRequestDataFailure<T>({
      _root: "No data provided",
    });
  }

  /**
   * Ensure request body is object
   */
  if (typeof request.body !== "object") {
    return new InvalidRequestDataFailure<T>({
      _root: "Provided data was not an object",
    });
  }

  /**
   * Ensure request body is not array
   *
   * (This is done due to having experienced bugs with yup:
   * With a schema for an object type T that should only pass
   * objects of type T, Array<T> will also pass some validations.
   * This prevents us from running into that problem.)
   */
  if (Array.isArray(request.body)) {
    return new InvalidRequestDataFailure<T>({
      _root: "Provided data was an array",
    });
  }

  const parsed = schema.safeParse(request.body);

  if (parsed.success) {
    return new Success(parsed.data);
  } else {
    return new InvalidRequestDataFailure<T>(
      parsed.error.errors.reduce((errors, next) => {
        const path = next.path.map((_) => _.toString()).join(".");
        const msg = `${next.message} <${next.code}>`;
        return { ...errors, [path]: msg };
      }, {} as Record<string, string>)
    );
  }
}
