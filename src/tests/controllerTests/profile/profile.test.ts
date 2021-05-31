import { TestClient } from "../../TestClient";
import { PrismaClient } from "@prisma/client";
import { v4 as uuid } from "uuid";

const prisma = new PrismaClient();

describe("/api/categories", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("Blocks unauthenticated requests", async (done) => {
    const client = new TestClient();
    const response = await client.profile().get();
    expect(response.status).toBe(401);
    done();
  });

  it("Returns user data on authenticated requests", async (done) => {
    const client = new TestClient();
    const email = await client.authenticate(prisma);
    const response = await client.profile().get();
    expect(response.status).toBe(200);
    const profile = await response.json();
    expect(profile).toBeDefined();
    expect(profile.email).toBe(email);
    expect(profile.id).toBe(client.authenticatedUid);
    expect(profile.displayName).toBe(email);
    done();
  });

  it("Doesn't return password", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);
    const response = await client.profile().get();
    expect(response.status).toBe(200);
    const profile = await response.json();
    expect(profile).toBeDefined();
    expect(profile.password).toBeUndefined();
    done();
  });

  it("Allows updating profile properties", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    // Utility function for fetching the profile
    async function getProfile() {
      const getProfileResponse = await client.profile().get();
      expect(getProfileResponse.status).toBe(200);
      const profile = await getProfileResponse.json();
      expect(profile).toBeDefined();
      return profile;
    }

    // Initial profile
    let profile = await getProfile();
    expect(profile.displayName).not.toBe("new_name");
    expect(profile.themeColor).not.toBe("new_color");
    expect(profile.themeMode).not.toBe("new_mode");

    // Patch display name
    const patchResponse_1 = await client
      .profile()
      .patch({ displayName: "new_name" });
    profile = await getProfile();
    expect(patchResponse_1.status).toBe(200);
    expect(profile.displayName).toBe("new_name");

    // Patch themeColor
    const patchResponse_2 = await client
      .profile()
      .patch({ themeColor: "new_color" });
    profile = await getProfile();
    expect(patchResponse_2.status).toBe(200);
    expect(profile.themeColor).toBe("new_color");

    // Patch themeMode
    const patchResponse_3 = await client
      .profile()
      .patch({ themeMode: "new_mode" });
    profile = await getProfile();
    expect(patchResponse_3.status).toBe(200);
    expect(profile.themeMode).toBe("new_mode");

    // Attempt patching other details
    const fakeId = uuid();
    const fakeUrl = "https://nexpenda.com/fakeimage.png";
    const failedPatchResponses = await Promise.all(
      [
        { email: "fake@gmail.com" },
        { id: fakeId },
        { googleId: fakeId },
        { unknownProperty: "unknownProperty" },
        { photoUrl: fakeUrl },
        { googlePhotoUrl: fakeUrl },
      ].map((update) => client.profile().patch(update))
    );

    expect(failedPatchResponses[0].status).toBe(400);
    expect(failedPatchResponses[1].status).toBe(400);
    expect(failedPatchResponses[2].status).toBe(400);
    expect(failedPatchResponses[3].status).toBe(400);
    expect(failedPatchResponses[4].status).toBe(400);
    expect(failedPatchResponses[5].status).toBe(400);

    profile = await getProfile();

    expect(profile.email).not.toBe("fake@gmail.com");
    expect(profile.id).not.toBe(fakeId);
    expect(profile.googleId).not.toBe(fakeId);
    expect(profile.unknownProperty).toBeUndefined();
    expect(profile.photoUrl).not.toBe(fakeUrl);
    expect(profile.googlePhotoUrl).not.toBe(fakeUrl);

    done();
  });
});
