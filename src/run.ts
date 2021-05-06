import * as chalk from "chalk";
import { PrismaClient } from "@prisma/client";
import { configureEnvironment } from "./conf";

configureEnvironment();

async function run() {
  // Initialize
	console.log(chalk.bold.white("\nStarting..."))
  const prisma = new PrismaClient();
  await prisma.$connect();
	console.log(chalk.bold.green(`Prisma connected\n`))
	
  // Run any code with prisma below
	console.log(`Example code`)

	// Finish message
	console.log(chalk.bold.green("\nFinished\n"))
}

run().then(() => process.exit(0));
