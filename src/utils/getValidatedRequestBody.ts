import * as yup from "yup";
import { InvalidRequestDataError } from "../errors/InvalidRequestDataError";
import { Request } from "express";

export async function getValidatedRequestBody<T extends object>(
  request: Request,
  schema: yup.ObjectSchema<T>
): Promise<T> {
  if (!request.body) {
    throw new InvalidRequestDataError("No data provided");
  }

  if (typeof request.body !== "object") {
    throw new InvalidRequestDataError("Provided data was not an object");
  }

  if (Array.isArray(request.body)) {
    throw new InvalidRequestDataError("Provided data was an array");
  }

  try {
    const validatedBody = await schema.validate(request.body, {
      strict: true,
      abortEarly: false,
      stripUnknown: true,
    });
    return validatedBody;
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      throw new InvalidRequestDataError(error.errors.join("; "));
    } else {
      throw new InvalidRequestDataError(
        "Unknown request body validation error"
      );
    }
  }
}
