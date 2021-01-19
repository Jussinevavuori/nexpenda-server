import { TestClient } from "../../TestClient";
import { PrismaClient } from "@prisma/client";
import * as faker from "faker";
import * as jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { conf } from "../../../conf";

const prisma = new PrismaClient();

describe("/api/auth/change_password/ [POST]", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("Changes the user's password", async (done) => {
    const client = new TestClient();
    const email = await client.authenticate(prisma);
    await client.auth().logout();
    const before = await prisma.user.findUnique({ where: { email } });
    const token = await client.fabricateForgotPasswordToken(before!.id, prisma);
    const password = faker.internet.password();
    const loginAttempt1 = await client.auth().login({
      email,
      password,
    });
    const loginAttempt1Body = await loginAttempt1.json();
    const loginAttempt1Code = loginAttempt1Body.code;
    expect(loginAttempt1.status).toBe(400);
    expect(loginAttempt1Code).toBe("auth/invalid-credentials");
    const response = await client
      .auth()
      .changePassword(token.jwt)
      .post({ password });
    expect(response.status).toBe(200);
    const after = await prisma.user.findUnique({ where: { email } });
    const loginAttempt2 = await client.auth().login({
      email,
      password,
    });
    expect(loginAttempt2.status).toBe(200);
    expect(before!.password).not.toBe(after!.password);
    expect(before!.tokenVersion).toBe(after!.tokenVersion - 1);
    done();
  });

  it("Fails after user has already changed password", async (done) => {
    const client = new TestClient();
    const email = await client.authenticate(prisma);
    const userRecord = await prisma.user.findUnique({ where: { email } });
    const token = await client.fabricateForgotPasswordToken(
      userRecord!.id,
      prisma
    );
    const response1 = await client
      .auth()
      .changePassword(token.jwt)
      .post({ password: faker.internet.password() });
    const response2 = await client
      .auth()
      .changePassword(token.jwt)
      .post({ password: faker.internet.password() });
    expect(response1.status).toBe(200);
    expect(response2.status).toBe(400);
    const json = await response2.json();
    expect(json.code).toBe("auth/invalid-token");
    done();
  });

  it("Fails on invalid users", async (done) => {
    const client = new TestClient();
    const fakeUid = uuid();
    const token = client.fabricateConfirmEmailToken(fakeUid);
    const response = await client.auth().changePassword(token).post({
      password: faker.internet.password(),
    });
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
    const response = await client.auth().changePassword(token).post({
      password: faker.internet.password(),
    });
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
        tkt: "forgot_password",
      },
      conf.token.forgotPasswordToken.secret,
      { issuer: conf.token.issuer, audience: conf.token.audience, expiresIn: 1 }
    );
    await new Promise((res) => setTimeout(res, 1000));
    const response = await client.auth().changePassword(token).post({
      password: faker.internet.password(),
    });
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
        tkt: "forgot_password",
      },
      "invalid_secret",
      {
        issuer: conf.token.issuer,
        audience: conf.token.audience,
        expiresIn: conf.token.forgotPasswordToken.expiresIn,
      }
    );
    const response = await client.auth().changePassword(token).post({
      password: faker.internet.password(),
    });
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.code).toBe("auth/invalid-token");
    done();
  });
});
