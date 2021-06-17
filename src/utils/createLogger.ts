/**
 * Create a logger which wraps the console.log feature and provides a prefix
 * for the logs.
 *
 * Example:
 * ```
 * const logger = createLogger({name: "TestLogger"})
 *
 * // Logs: [TestLogger]: Hello, world!
 * logger("Hello, world!")
 * ```
 */
export function createLogger(options: { name?: string } = { name: "App" }) {
  return function (...args: any[]) {
    console.log(`[${options.name}]:`, ...args);
  };
}
