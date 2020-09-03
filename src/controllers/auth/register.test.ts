import { TestClient } from "../../tests/TestClient";
import * as faker from "faker";
import * as jwt from "jsonwebtoken";
import { conf } from "../../conf";

describe("/api/auth/register", () => {
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

  it("succeeds on proper data", async (done) => {
    const client = new TestClient();
    const response = await client.auth().register({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    expect(response.status).toBe(200);
    done();
  });

  it("succeeds and sends refresh token as cookie", async (done) => {
    const client = new TestClient();
    const response = await client.auth().register({
      email: faker.internet.email(),
      password: faker.internet.password(),
    });
    expect(
      response.headers
        .raw()
        ["set-cookie"].find((_) =>
          _.startsWith(`${conf.token.refreshToken.name}=`)
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
    expect(client1.refreshToken).toBeDefined();
    expect(client2.refreshToken).not.toBeDefined();
    expect(client1.authenticatedUid).toBeDefined();
    expect(client2.authenticatedUid).not.toBeDefined();
    done();
  });
});
