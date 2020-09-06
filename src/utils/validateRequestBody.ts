import * as yup from "yup";
import { Request } from "express";
import { Errors } from "../errors/Errors";
import { Result, Success, Failure } from "./Result";

export async function validateRequestBody<T extends object>(
  request: Request,
  schema: yup.ObjectSchema<T>
): Promise<Result<T>> {
  /**
   * Ensure request body is defined
   */
  if (!request.body) {
    return new Failure<T>(
      Errors.Data.InvalidRequestData({
        _root: "No data provided",
      })
    );
  }

  /**
   * Ensure request body is object
   */
  if (typeof request.body !== "object") {
    return new Failure<T>(
      Errors.Data.InvalidRequestData({
        _root: "Provided data was not an object",
      })
    );
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
    return new Failure<T>(
      Errors.Data.InvalidRequestData({
        _root: "Provided data was an array",
      })
    );
  }

  return schema
    .validate(request.body, {
      strict: true,
      abortEarly: false,
      stripUnknown: true,
    })
    .then((body) => {
      return new Success(body);
    })
    .catch((error) => {
      // Parse yup validation error fields
      if (error instanceof yup.ValidationError) {
        return new Failure<T>(
          Errors.Data.InvalidRequestData<T>(
            error.inner.reduce((errors, next) => {
              return { ...errors, [next.path]: next.message };
            }, {})
          )
        );
      } else {
        return new Failure<T>(
          Errors.Data.InvalidRequestData<T>({ _root: "Unknown error" })
        );
      }
    });
}
