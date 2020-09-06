import { TestClient } from "../../tests/TestClient";
import { ForgotPasswordToken } from "../../services/ForgotPasswordToken";
import { User } from "@prisma/client";
import { internet as faker } from "faker/locale/de_CH";

async function postPassword(password: any) {
  return;
}

describe("/forgot_password > POST", () => {
  it("blocks invalid tokens", async (done) => {
    const client = new TestClient();
    const response = await client.post(
      "/forgot_password/invalid",
      {
        password: faker.password(),
      },
      { omitApiInEndpoint: true }
    );
    const { message } = await response.json();
    expect(message).toBe("Invalid, expired or already used link");
    done();
  });

  it("does not allow invalid data", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const token = new ForgotPasswordToken({
      id: client.authenticatedUid!,
      tokenVersion: 1,
    } as User);
    const responses = await Promise.all([
      client.post(
        "/forgot_password/" + token.jwt,
        {
          password: "",
        },
        { omitApiInEndpoint: true }
      ),
      client.post(
        "/forgot_password/" + token.jwt,
        {
          password: "a",
        },
        { omitApiInEndpoint: true }
      ),
      client.post(
        "/forgot_password/" + token.jwt,
        {
          password: "a".repeat(1000),
        },
        { omitApiInEndpoint: true }
      ),
      client.post(
        "/forgot_password/" + token.jwt,
        {
          password: null,
        },
        { omitApiInEndpoint: true }
      ),
      client.post(
        "/forgot_password/" + token.jwt,
        {
          password: [],
        },
        { omitApiInEndpoint: true }
      ),
      client.post(
        "/forgot_password/" + token.jwt,
        {
          password: {},
        },
        { omitApiInEndpoint: true }
      ),
      client.post(
        "/forgot_password/" + token.jwt,
        {
          password: undefined,
        },
        { omitApiInEndpoint: true }
      ),
    ]);
    expect(responses[0].status).toBe(400);
    expect(responses[1].status).toBe(400);
    expect(responses[2].status).toBe(400);
    expect(responses[3].status).toBe(400);
    expect(responses[4].status).toBe(400);
    expect(responses[5].status).toBe(400);
    expect(responses[6].status).toBe(400);
    const jsons = await Promise.all(responses.map((_) => _.json()));
    const messages = await Promise.all(jsons.map((_) => _.message));
    expect(messages[0]).toBe("Invalid password. Try another password.");
    expect(messages[1]).toBe("Invalid password. Try another password.");
    expect(messages[2]).toBe("Invalid password. Try another password.");
    expect(messages[3]).toBe("Invalid password. Try another password.");
    expect(messages[4]).toBe("Invalid password. Try another password.");
    expect(messages[5]).toBe("Invalid password. Try another password.");
    expect(messages[6]).toBe("Invalid password. Try another password.");
    done();
  });

  it("allows valid data", async (done) => {
    const client = new TestClient();
    const email = faker.email();
    const password = faker.password();
    await client.auth().register({
      email,
      password,
    });
    const token = new ForgotPasswordToken({
      id: client.authenticatedUid!,
      tokenVersion: 1,
    } as User);
    const response = await client.post(
      "/forgot_password/" + token.jwt,
      {
        password: faker.password(),
      },
      { omitApiInEndpoint: true }
    );
    expect(response.status).toBe(200);
    done();
  });

  it("succesfully changes password", async (done) => {
    const client = new TestClient();
    const email = faker.email();
    const password = faker.password();
    await client.auth().register({
      email,
      password,
    });
    const token = new ForgotPasswordToken({
      id: client.authenticatedUid!,
      tokenVersion: 1,
    } as User);

    await client.auth().logout();
    const loginResponse1 = await client.auth().login({ email, password });
    expect(loginResponse1.status).toBe(200);

    const newPassword = faker.password();

    await client.post(
      "/forgot_password/" + token.jwt,
      {
        password: newPassword,
      },
      {
        omitApiInEndpoint: true,
      }
    );

    await client.auth().logout();
    const loginResponse2 = await client.auth().login({ email, password });
    expect(loginResponse2.status).toBe(400);

    await client.auth().logout();
    const loginResponse3 = await client
      .auth()
      .login({ email, password: newPassword });
    expect(loginResponse3.status).toBe(200);
    done();
  });
});
