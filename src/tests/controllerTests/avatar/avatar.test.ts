import { TestClient } from "../../TestClient";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function getMockedValidUrl() {
  return `https://lh1.googleusercontent.com/mocked-test-image/img.jpg`;
}

describe("/api/avatar", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("Blocks unauthenticated requests", async (done) => {
    const client = new TestClient();
    const response = await client.avatar().put({ url: getMockedValidUrl() });
    expect(response.status).toBe(401);
    done();
  });

  it("Returns updated user data on authenticated requests", async (done) => {
    const client = new TestClient();
    const email = await client.authenticate(prisma);

    const url = getMockedValidUrl();
    const response = await client.avatar().put({ url });
    expect(response.status).toBe(200);
    const profile = await response.json();
    expect(profile).toBeDefined();
    expect(profile.email).toBe(email);
    expect(profile.id).toBe(client.authenticatedUid);
    expect(profile.photoUrl).toBe(url);
    done();
  });

  it("Allows updating only valid URLs", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const url = getMockedValidUrl();
    const initialResponse = await client.avatar().put({ url });
    expect(initialResponse.status).toBe(200);
    const initialProfile = await initialResponse.json();
    expect(initialProfile).toBeDefined();
    expect(initialProfile.photoUrl).toBe(url);

    const invalidUrl = `asdoisafiudshapoi uopifuioweuam`;
    const response = await client.avatar().put({ url: invalidUrl });
    expect(response.status).toBe(400);

    done();
  });

  it("Allows updating only valid domains", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const url = getMockedValidUrl();
    const initialResponse = await client.avatar().put({ url });
    expect(initialResponse.status).toBe(200);
    const initialProfile = await initialResponse.json();
    expect(initialProfile).toBeDefined();
    expect(initialProfile.photoUrl).toBe(url);

    const invalidUrl = `https://i.imgur.com/oeYzasc.jpg`;
    const response = await client.avatar().put({ url: invalidUrl });
    expect(response.status).toBe(400);

    done();
  });
});
