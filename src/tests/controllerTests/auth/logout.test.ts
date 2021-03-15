import { TestClient } from "../../TestClient";
import { conf } from "../../../conf";
import { TestUtils } from "../../TestUtils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/auth/logout/ [POST]", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("sends clear cookie header", async (done) => {
    const client = new TestClient();
    const response = await client.auth().logout();
    const refreshToken = TestUtils.parseCookieFromResponse(
      response,
      conf.token.refreshToken.name
    );
    expect(response.status).toBe(200);
    expect(refreshToken).toBeDefined();
    expect(refreshToken!.length).toBe(0);
    done();
  });

  it("blocks authenticated user from reaching protected endpoints", async (done) => {
    const client = new TestClient();

    const response1 = await client.ping({ protected: true });
    expect(response1.status).toBe(401);

    await client.authenticate(prisma);

    const response2 = await client.ping({ protected: true });
    expect(response2.status).toBe(200);

    await client.auth().logout();

    const response3 = await client.ping({ protected: true });
    expect(response3.status).toBe(401);

    done();
  });
});
