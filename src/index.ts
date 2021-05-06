import { configureEnvironment } from "./conf";
configureEnvironment({ skipInProduction: true });

// Start server
import("./server").then((_) => _.startServer());
