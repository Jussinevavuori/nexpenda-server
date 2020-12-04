import { TestClient } from "../../tests/TestClient";
import { internet as faker } from "faker";
import * as jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/auth/refresh_token", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("blocks requests without a refresh token", async (done) => {
    const client = new TestClient();
    const response = await client.auth().refreshToken();
    expect(response.status).toBe(401);
    done();
  });

  it("allows requests with a refresh token and sends a valid access token", async (done) => {
    const client = new TestClient();
    const email = faker.email();
    const password = faker.password();
    await client.auth().register({ email, password });
    const user = await prisma.user.findUnique({ where: { email } });
    await client
      .auth()
      .confirmEmail(client.fabricateConfirmEmailToken(user!.id));
    await client.auth().login({ email, password });
    const response = await client.auth().refreshToken();
    expect(response.status).toBe(200);
    expect(client.accessToken).toBeDefined();
    const payload = jwt.decode(client.accessToken!);
    expect(payload).toBeDefined();
    expect((payload as any).uid).toBeDefined();
    expect(typeof (payload as any).uid).toBe("string");
    done();
  });

  it("allows requests with a refresh token and access token", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);
    const response = await client.auth().refreshToken();
    expect(response.status).toBe(200);
    done();
  });

  it("allows access to protected resources only after token is refreshed", async (done) => {
    const client = new TestClient();
    const email = faker.email();
    const password = faker.password();
    await client.auth().register({ email, password });
    const user = await prisma.user.findUnique({ where: { email } });
    const token = client.fabricateConfirmEmailToken(user!.id);
    await client.auth().confirmEmail(token);
    await client.auth().login({ email, password });
    const response1 = await client.ping({ protected: true });
    expect(response1.status).toBe(401);
    await client.auth().refreshToken();
    const response2 = await client.ping({ protected: true });
    expect(response2.status).toBe(200);
    done();
  });
});
