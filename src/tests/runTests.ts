import * as jest from "jest-cli";
import { configureEnvironment } from "../env";
import { prisma, startServer } from "../server";

async function initialize() {
  await configureEnvironment();
  await startServer();

  await prisma.budgetCategoryInclusion.deleteMany({
    where: { budgetId: { not: "_" } },
  });
  await prisma.budget.deleteMany({ where: { uid: { not: "_" } } });
  await prisma.transaction.deleteMany({ where: { uid: { not: "_" } } });
  await prisma.category.deleteMany({ where: { uid: { not: "_" } } });
  await prisma.profile.deleteMany({ where: { uid: { not: "_" } } });
  await prisma.user.deleteMany({ where: { id: { not: "_" } } });
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

  const testNamePattern = getTestNamePattern();

  if (testNamePattern) {
    console.log(`# Running only tests matching ${testNamePattern}`);
  } else {
    console.log(`# Running all tests`);
  }

  await runTests({
    runInBand: true,
    detectOpenHandles: true,
    forceExit: true,
    testNamePattern,
  });

  await teardown();
}

function getTestNamePattern() {
  let testNamePatternArg: undefined | string;

  const indexOfSimpleFlag = process.argv.findIndex((arg) => arg === "-t");
  if (indexOfSimpleFlag > 0) {
    testNamePatternArg = process.argv[indexOfSimpleFlag + 1];
  }

  const complexFlag = process.argv.find((arg) => arg.startsWith("--t="));
  if (complexFlag) {
    testNamePatternArg = complexFlag.substring(4);
  }

  if (testNamePatternArg) {
    return testNamePatternArg;
  }
}

run();
