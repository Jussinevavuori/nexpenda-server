import { TestClient } from "../../TestClient";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/ping/ [GET]", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("pongs", async (done) => {
    const client = new TestClient();
    const response = await client.ping();
    const text = await response.text();
    expect(text).toBe("pong");
    done();
  });
});
