import { z } from "zod";
import { Request } from "express";
import { validateOr } from "./validate";

/**
 * Utility function for getting all query parameters from a request and
 * validating them against a schema. All query parameters should be marked
 * as optional in the schema.
 */
export function getQuery<In extends object, Out extends object>(
  request: Request,
  schema: z.Schema<Out, z.ZodTypeDef, In>
): Partial<Out> {
  return validateOr(request.query, schema, {});
}
