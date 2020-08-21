import * as dotenv from "dotenv";
dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

import { PrismaClient } from "@prisma/client";

async function main() {
  try {
    console.log("Running in", process.env.NODE_ENV, "mode");

    // console.log("env:	", process.env);

    const prisma = new PrismaClient();

    console.log("Created prisma client");

    await prisma.$connect();

    console.log("Connected prisma client");

    const transactions = await prisma.transaction.findMany({});

    console.log(transactions);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
