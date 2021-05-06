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
    expect(profile.photoUrl).not.toBe("new_photo");
    expect(profile.themeColor).not.toBe("new_color");
    expect(profile.themeMode).not.toBe("new_mode");

    // Patch display name
    const patchResponse_1 = await client
      .profile()
      .patch({ displayName: "new_name" });
    profile = await getProfile();
    expect(patchResponse_1.status).toBe(200);
    expect(profile.displayName).toBe("new_name");

    // Patch photo URL
    const patchResponse_2 = await client
      .profile()
      .patch({ photoUrl: "new_photo" });
    profile = await getProfile();
    expect(patchResponse_2.status).toBe(200);
    expect(profile.photoUrl).toBe("new_photo");

    // Patch themeColor
    const patchResponse_3 = await client
      .profile()
      .patch({ themeColor: "new_color" });
    profile = await getProfile();
    expect(patchResponse_3.status).toBe(200);
    expect(profile.themeColor).toBe("new_color");

    // Patch themeMode
    const patchResponse_4 = await client
      .profile()
      .patch({ themeMode: "new_mode" });
    profile = await getProfile();
    expect(patchResponse_4.status).toBe(200);
    expect(profile.themeMode).toBe("new_mode");

    // Attempt patching other details
    const newEmail = "new@gmail.com";
    const failedPatchResponse_1 = await client.profile().patch({
      email: newEmail,
    });

    const newId = uuid();
    const failedPatchResponse_2 = await client.profile().patch({
      id: newId,
    });

    const newGoogleId = uuid();
    const failedPatchResponse_3 = await client.profile().patch({
      googleId: newGoogleId,
    });

    const unknownProperty = "unknownProperty";
    const failedPatchResponse_4 = await client.profile().patch({
      unknownProperty,
    });

    expect(failedPatchResponse_1.status).toBe(400);
    expect(failedPatchResponse_2.status).toBe(400);
    expect(failedPatchResponse_3.status).toBe(400);
    expect(failedPatchResponse_4.status).toBe(400);

    profile = await getProfile();

    expect(profile.email).not.toBe(newEmail);
    expect(profile.id).not.toBe(newId);
    expect(profile.googleId).not.toBe(newGoogleId);
    expect(profile.unknownProperty).toBeUndefined();

    done();
  });
});
