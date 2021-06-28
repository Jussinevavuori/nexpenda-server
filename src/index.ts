import { configureEnvironment } from "./env";

/**
 * Configure environment.
 */
configureEnvironment({ skipInProduction: true });

/**
 * Start server after environment is configured.
 */
import("./server").then((_) => _.startServer());
