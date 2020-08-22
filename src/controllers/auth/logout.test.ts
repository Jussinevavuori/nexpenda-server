import { TestClient } from "../../tests/TestClient";
import { conf } from "../../conf";
import { testUtils } from "../../tests/testUtils";

describe("/api/auth/logout", () => {
  it("does nothing on unauthenticated request", async (done) => {
    const client = new TestClient();
    const response = await client.auth().logout();
    expect(response.status).toBe(302);
    done();
  });
  it("sends clear cookie header", async (done) => {
    const client = new TestClient();
    const response = await client.auth().logout();
    const refreshToken = testUtils.parseCookieFromResponse(
      response,
      conf.token.refreshToken.name
    );
    expect(refreshToken).toBeDefined();
    expect(refreshToken!.length).toBe(0);
    done();
  });
  it("blocks authenticated user from reaching protected endpoints", async (done) => {
    const client = new TestClient();

    const response1 = await client.ping({ protected: true });
    expect(response1.status).toBe(401);

    await client.authenticate();

    const response2 = await client.ping({ protected: true });
    expect(response2.status).toBe(200);

    await client.auth().logout();

    const response3 = await client.ping({ protected: true });
    expect(response3.status).toBe(401);

    done();
  });
});
