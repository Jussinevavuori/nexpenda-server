import { PrismaClient } from "@prisma/client";

async function run() {
  const prisma = new PrismaClient();
  await prisma.$connect();
}

run();
