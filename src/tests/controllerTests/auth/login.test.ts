import { TestClient } from "../../TestClient";
import * as faker from "faker";
import * as jwt from "jsonwebtoken";
import { ENV } from "../../../env";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/auth/login/ [POST]", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("blocks requests without data", async (done) => {
    const client = new TestClient();
    const response = await client.auth().login(undefined);
    expect(response.status).toBe(400);
    done();
  });

  it("blocks requests with extra or invalid data", async (done) => {
    const client = new TestClient();
    const responses = await Promise.all([
      client.auth().login(null),
      client.auth().login("string"),
      client.auth().login([]),
      client.auth().login(1),
      client.auth().login(true),
      client.auth().login([
        {
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      ]),
    ]);
    expect(responses[0].status).toBe(400);
    expect(responses[1].status).toBe(400);
    expect(responses[2].status).toBe(400);
    expect(responses[3].status).toBe(400);
    expect(responses[4].status).toBe(400);
    expect(responses[5].status).toBe(400);
    done();
  });

  it("fails when user email not confirmed", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const response = await client.auth().login({ email, password });
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.code).toBe("auth/email-not-confirmed");
    done();
  });

  it("fails when user does not exist", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const response = await client.auth().login({ email, password });
    const body = await response.json();
    expect(response.status).toBe(404);
    expect(body.code).toBe("auth/user-not-found");
    done();
  });

  it("fails with wrong password", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    await client
      .auth()
      .register({ email, password: faker.internet.password() });
    const userInDb = await prisma.user.findUnique({ where: { email } });
    const token = client.fabricateConfirmEmailToken(userInDb!.id);
    await client.auth().confirmEmail(token);
    const response = await client
      .auth()
      .login({ email, password: faker.internet.password() });
    const body = await response.json();
    expect(response.status).toBe(400);
    expect(body.code).toBe("auth/invalid-credentials");
    done();
  });

  it("succeeds on correct credentials", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const userInDb = await prisma.user.findUnique({ where: { email } });
    const token = client.fabricateConfirmEmailToken(userInDb!.id);
    await client.auth().confirmEmail(token);
    const response = await client.auth().login({ email, password });
    expect(response.status).toBe(200);
    done();
  });

  it("succeeds and sends refresh token as cookie", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const userInDb = await prisma.user.findUnique({ where: { email } });
    const token = client.fabricateConfirmEmailToken(userInDb!.id);
    await client.auth().confirmEmail(token);
    const response = await client.auth().login({ email, password });
    expect(response.status).toBe(200);
    expect(
      response.headers
        .raw()
        ["set-cookie"].find((_) =>
          _.startsWith(`${ENV.token.refreshToken.name}=`)
        )
    ).toBeDefined();
    expect(client.refreshToken).toBeDefined();
    const decoded = jwt.decode(client.refreshToken!) as any;
    expect(decoded).not.toBeNull();
    expect(decoded).toBeDefined();
    expect(decoded.uid).toBeDefined();
    expect(typeof decoded.uid).toBe("string");
    done();
  });
});
