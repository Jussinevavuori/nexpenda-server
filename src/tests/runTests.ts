import * as jest from "jest-cli";
import { startServer, connection } from "../server";

async function initialize() {
  await startServer();
}

async function runTests(options?: {
  runInBand?: boolean;
  forceExit?: boolean;
  detectOpenHandles?: boolean;
  testNamePattern?: string;
}) {
  const cliOptions: string[] = [];
  if (options) {
    if (options.runInBand) {
      cliOptions.push("--runInBand");
    }
    if (options.forceExit) {
      cliOptions.push("--forceExit");
    }
    if (options.detectOpenHandles) {
      cliOptions.push("--detectOpenHandles");
    }
    if (options.testNamePattern) {
      cliOptions.push(`--testNamePattern=${options.testNamePattern}`);
    }
  }
  await jest.run(cliOptions);
}

async function teardown() {
  if (connection) {
    await connection.close();
  }
}

async function run() {
  await initialize();
  await runTests({
    runInBand: true,
    detectOpenHandles: true,
    forceExit: true,
    testNamePattern: "transactions",
  });
  await teardown();
}

run();
