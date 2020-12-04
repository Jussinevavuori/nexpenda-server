import { TestClient } from "../../tests/TestClient";
import * as faker from "faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/auth/request_confirm_email", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("Expects correct data", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const res0 = await client.auth().requestConfirmEmail(undefined);
    const res1 = await client.auth().requestConfirmEmail(null);
    const res2 = await client.auth().requestConfirmEmail({});
    const res3 = await client.auth().requestConfirmEmail({ username: "" });
    const res4 = await client.auth().requestConfirmEmail({ email: 123 });
    const res5 = await client.auth().requestConfirmEmail(email);
    expect(res0.status).toBe(400);
    expect(res1.status).toBe(400);
    expect(res2.status).toBe(400);
    expect(res3.status).toBe(400);
    expect(res4.status).toBe(400);
    expect(res5.status).toBe(400);
    const json0 = await res0.json();
    const json1 = await res1.json();
    const json2 = await res2.json();
    const json3 = await res3.json();
    const json4 = await res4.json();
    const json5 = await res5.json();
    expect(json0.code).toBe("request/invalid-request-data");
    expect(json1.code).toBe("request/invalid-request-data");
    expect(json2.code).toBe("request/invalid-request-data");
    expect(json3.code).toBe("request/invalid-request-data");
    expect(json4.code).toBe("request/invalid-request-data");
    expect(json5.code).toBe("request/invalid-request-data");
    done();
  });

  it("Fails on user not found", async (done) => {
    const client = new TestClient();
    const response = await client
      .auth()
      .requestConfirmEmail({ email: faker.internet.email() });
    const json = await response.json();
    expect(response.status).toBe(404);
    expect(json.code).toBe("auth/user-not-found");
    done();
  });

  it("Succeeds", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const response = await client.auth().requestConfirmEmail({ email });
    expect(response.status).toBe(200);
    done();
  });

  it("Fails after email already confirmed", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    await client.auth().register({ email, password });
    const record = await prisma.user.findUnique({ where: { email } });
    const token = client.fabricateConfirmEmailToken(record!.id);
    await client.auth().confirmEmail(token);
    const response = await client.auth().requestConfirmEmail({ email });
    const json = await response.json();
    expect(response.status).toBe(400);
    expect(json.code).toBe("auth/email-already-confirmed");
    done();
  });
});
