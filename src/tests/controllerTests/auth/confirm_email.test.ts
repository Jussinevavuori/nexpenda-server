import * as faker from "faker";
import * as jwt from "jsonwebtoken";
import { TestClient } from "../../TestClient";
import { v4 as uuid } from "uuid";
import { ENV } from "../../../env";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/auth/confirm_email/ [POST]", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("Blocks login before email confirmation", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const response = await client.auth().login({ email, password });
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.code).toBe("auth/email-not-confirmed");
    done();
  });

  it("Allows requests after email confirmation", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const record = await prisma.user.findUnique({ where: { email } });
    const token = client.fabricateConfirmEmailToken(record!.id);
    await client.auth().confirmEmail(token);
    const response = await client.auth().login({ email, password });
    expect(response.status).toBe(200);
    done();
  });

  it("Fails on invalid users", async (done) => {
    const client = new TestClient();
    const fakeUid = uuid();
    const token = client.fabricateConfirmEmailToken(fakeUid);
    const response = await client.auth().confirmEmail(token);
    const json = await response.json();
    expect(response.status).toBe(404);
    expect(json.code).toBe("auth/user-not-found");
    done();
  });

  it("Fails on invalid string as token", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const token = faker.random.uuid();
    const response = await client.auth().confirmEmail(token);
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
        tkt: "confirm_email",
      },
      ENV.token.confirmEmailToken.secret,
      { issuer: ENV.token.issuer, audience: ENV.token.audience, expiresIn: 1 }
    );
    await new Promise((res) => setTimeout(res, 1000));
    const response = await client.auth().confirmEmail(token);
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
        tkt: "confirm_email",
      },
      "invalid_secret",
      {
        issuer: ENV.token.issuer,
        audience: ENV.token.audience,
        expiresIn: ENV.token.confirmEmailToken.expiresIn,
      }
    );
    const response = await client.auth().confirmEmail(token);
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.code).toBe("auth/invalid-token");
    done();
  });
});
