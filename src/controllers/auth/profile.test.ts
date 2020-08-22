import { TestClient } from "../../tests/TestClient";

describe("/auth/profile", () => {
  it("blocks unauthenticated requests", async (done) => {
    const client = new TestClient();
    const response = await client.auth().profile();
    expect(response.status).toBe(401);
    done();
  });

  it("returns user data on authenticated requests", async (done) => {
    const client = new TestClient();
    const email = await client.authenticate();
    const response = await client.auth().profile();
    expect(response.status).toBe(200);
    const profile = await response.json();
    expect(profile).toBeDefined();
    expect(profile.email).toBe(email);
    expect(profile.id).toBe(client.authenticatedUid);
    expect(profile.displayName).toBe(email);
    done();
  });

  it("doesn't return password", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const response = await client.auth().profile();
    expect(response.status).toBe(200);
    const profile = await response.json();
    expect(profile).toBeDefined();
    expect(profile.password).toBeUndefined();
    done();
  });
});
