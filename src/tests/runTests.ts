import * as jest from "jest-cli";
import { startServer, prisma } from "../server";

async function initialize() {
  await startServer();

  await prisma.transaction.deleteMany({
    where: { id: { not: { equals: "" } } },
  });
  await prisma.user.deleteMany({
    where: { id: { not: { equals: "" } } },
  });
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
  await prisma.$disconnect();
}

async function run() {
  await initialize();
  await runTests({
    runInBand: true,
    detectOpenHandles: true,
    forceExit: true,
    testNamePattern: getTestNamePattern(),
  });
  await teardown();
}

function getTestNamePattern() {
  const testNamePatternArg = process.argv.find((arg) => arg.startsWith("-t="));
  if (testNamePatternArg) {
    return testNamePatternArg.substring(3);
  }
}

run();
