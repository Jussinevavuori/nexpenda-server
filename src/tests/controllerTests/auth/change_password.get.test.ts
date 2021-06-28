import { TestClient } from "../../TestClient";
import { PrismaClient } from "@prisma/client";
import * as faker from "faker";
import * as jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { ENV } from "../../../env";

const prisma = new PrismaClient();

describe("/api/auth/change_password [GET]", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("Succeeds and returns user's email on valid request", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const userRecord = await prisma.user.findUnique({ where: { email } });
    const token = await client.fabricateResetPasswordToken(
      userRecord!.id,
      prisma
    );
    const response = await client.auth().changePassword(token.jwt).get();
    expect(response.status).toBe(200);
    const text = await response.text();
    expect(text).toBe(email);
    done();
  });

  it("Fails after user has already changed password", async (done) => {
    const client = new TestClient();
    const email = await client.authenticate(prisma);
    const userRecord = await prisma.user.findUnique({ where: { email } });
    const token1 = await client.fabricateResetPasswordToken(
      userRecord!.id,
      prisma
    );
    const token2 = await client.fabricateResetPasswordToken(
      userRecord!.id,
      prisma
    );
    const response1 = await client.auth().changePassword(token1.jwt).get();
    expect(response1.status).toBe(200);
    await client
      .auth()
      .changePassword(token1.jwt)
      .post({ password: faker.internet.password() });
    const response2 = await client.auth().changePassword(token2.jwt).get();
    expect(response2.status).toBe(400);
    const json = await response2.json();
    expect(json.code).toBe("auth/invalid-token");
    done();
  });

  it("Fails on invalid users", async (done) => {
    const client = new TestClient();
    const fakeUid = uuid();
    const token = client.fabricateConfirmEmailToken(fakeUid);
    const response = await client.auth().changePassword(token).get();
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.code).toBe("auth/invalid-token");
    done();
  });

  it("Fails on invalid string as token", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const token = faker.random.uuid();
    const response = await client.auth().changePassword(token).get();
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.code).toBe("auth/invalid-token");
    done();
  });

  it("Fails on expired token", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const record = await prisma.user.findUnique({ where: { email } });
    const token = jwt.sign(
      {
        uid: record!.id,
        vrs: record!.tokenVersion,
        tkt: "reset_password",
      },
      ENV.token.resetPasswordToken.secret,
      { issuer: ENV.token.issuer, audience: ENV.token.audience, expiresIn: 1 }
    );
    await new Promise((res) => setTimeout(res, 1000));
    const response = await client.auth().changePassword(token).get();
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.code).toBe("auth/invalid-token");
    done();
  });

  it("Fails on unauthorized token", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const record = await prisma.user.findUnique({ where: { email } });
    const token = jwt.sign(
      {
        uid: record!.id,
        vrs: record!.tokenVersion,
        tkt: "reset_password",
      },
      "invalid_secret",
      {
        issuer: ENV.token.issuer,
        audience: ENV.token.audience,
        expiresIn: ENV.token.resetPasswordToken.expiresIn,
      }
    );
    const response = await client.auth().changePassword(token).get();
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.code).toBe("auth/invalid-token");
    done();
  });
});
