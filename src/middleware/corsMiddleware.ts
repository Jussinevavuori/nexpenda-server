import * as cors from "cors";

/**
 * Cors middleware
 */
export function corsMiddleware() {
  return cors({
    credentials: true,
    origin: true,
  });
}
