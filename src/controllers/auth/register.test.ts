import { TestClient } from "../../tests/TestClient";
import * as faker from "faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/auth/register", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("blocks requests without data", async (done) => {
    const client = new TestClient();
    const response = await client.auth().register(undefined);
    expect(response.status).toBe(400);
    done();
  });

  it("blocks request with invalid or missing email", async (done) => {
    const client = new TestClient();
    const responses = await Promise.all([
      client.auth().register({
        email: "invalid",
        password: faker.internet.password(),
      }),
      client.auth().register({
        password: faker.internet.password(),
      }),
      client.auth().register({
        email: "",
        password: faker.internet.password(),
      }),
      client.auth().register({
        email: "x".repeat(200) + "@" + "x".repeat(200) + ".com",
        password: faker.internet.password(),
      }),
    ]);
    expect(responses[0].status).toBe(400);
    expect(responses[1].status).toBe(400);
    expect(responses[2].status).toBe(400);
    expect(responses[3].status).toBe(400);
    done();
  });

  it("blocks requests with invalid or missing password", async (done) => {
    const client = new TestClient();
    const responses = await Promise.all([
      client.auth().register({
        email: faker.internet.email(),
      }),
      client.auth().register({
        email: faker.internet.email(),
        password: "",
      }),
      client.auth().register({
        email: faker.internet.email(),
        password: "1",
      }),
    ]);
    expect(responses[0].status).toBe(400);
    expect(responses[1].status).toBe(400);
    expect(responses[2].status).toBe(400);
    done();
  });

  it("blocks requests with extra or invalid data", async (done) => {
    const client = new TestClient();
    const responses = await Promise.all([
      client.auth().register(null),
      client.auth().register("string"),
      client.auth().register([]),
      client.auth().register(1),
      client.auth().register(true),
      client.auth().register([
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

  it("cannot create user with same email twice", async (done) => {
    const client1 = new TestClient();
    const client2 = new TestClient();
    const email = faker.internet.email();
    const response1 = await client1.auth().register({
      email,
      password: faker.internet.password(),
    });
    const response2 = await client2.auth().register({
      email,
      password: faker.internet.password(),
    });
    expect(response1.status).toBe(200);
    expect(response2.status).toBe(400);
    done();
  });

  it("succeeds on proper data", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const response = await client.auth().register({
      email,
      password: faker.internet.password(),
    });
    expect(response.status).toBe(200);
    const userInDb = await prisma.user.findOne({ where: { email } });
    expect(userInDb).toBeDefined();
    expect(userInDb?.displayName).toBe(email);
    done();
  });

  it("hashes password", async (done) => {
    const client = new TestClient();
    const email = faker.internet.email();
    const password = faker.internet.password();
    const response = await client.auth().register({
      email,
      password,
    });
    expect(response.status).toBe(200);
    const userInDb = await prisma.user.findOne({ where: { email } });
    expect(userInDb?.password).toBeDefined();
    expect(userInDb?.password).not.toBe(password);
    done();
  });
});
