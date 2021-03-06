import { TestClient } from "../../TestClient";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/ping/protected/ [GET]", () => {
  it("does not pong on unauthenticated", async (done) => {
    const client = new TestClient();
    const response = await client.ping({ protected: true });
    expect(response.status).toBe(401);
    done();
  });

  it("pongs on authenticated", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);
    const response = await client.ping({ protected: true });
    const text = await response.text();
    expect(text.substring(0, 4)).toBe(`pong`);
    done();
  });

  it("pongs on authenticated with correct UID", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);
    const response = await client.ping({ protected: true });
    const text = await response.text();
    expect(text).toBe(`pong ${client.authenticatedUid}`);
    done();
  });
});
