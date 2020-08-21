import { TestClient } from "../../tests/TestClient";
import { mockTransaction } from "../../tests/testUtils";
import { v4 as uuid } from "uuid";

const ids = [uuid(), uuid(), uuid()];

const existingResources = (uid?: string) =>
  ids.map((id, index) => {
    return mockTransaction({
      integerAmount: index + 1,
      comment: `resource ${index + 1}`,
      category: "existing",
      date: index + 1,
      id,
      uid,
    });
  });

const setup = async (client: TestClient) => {
  if (!client.authenticatedUid) {
    await client.authenticate();
  }
  const posts = existingResources(client.authenticatedUid);
  await Promise.all(posts.map((post) => client.transactions().post(post)));
  return client;
};

describe("/api/transactions > PUT", () => {
  it("blocks unauthorized requests", async (done) => {
    const client = new TestClient();
    const id = uuid();
    const constructable = mockTransaction();
    const response = await client.transactions().put(id, constructable);
    expect(response.status).toBe(401);
    done();
  });

  it("can create new resource", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const uid = client.authenticatedUid;
    const id = uuid();
    const put = {
      integerAmount: 2,
      date: 2,
      comment: "update",
      category: "update",
    };
    await client.transactions().put(id, put);
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid);
    expect(result.integerAmount).toBe(2);
    expect(result.date).toBe(2);
    expect(result.comment).toBe("update");
    expect(result.category).toBe("update");
    done();
  });

  it("can fully update existing resouce", async (done) => {
    const client = await setup(new TestClient());
    const uid = client.authenticatedUid;
    const id = ids[0];
    const put = {
      integerAmount: 99,
      date: 99,
      comment: "update",
      category: "update",
    };
    await client.transactions().put(id, put);
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid);
    expect(result.integerAmount).toBe(99);
    expect(result.date).toBe(99);
    expect(result.comment).toBe("update");
    expect(result.category).toBe("update");
    done();
  });

  it("only updates targeted resource", async (done) => {
    const client = await setup(new TestClient());
    const put = {
      integerAmount: 99,
      date: 99,
      comment: "update",
      category: "update",
    };
    await client.transactions().put(ids[0], put);
    const result0 = await (await client.transactions().get(ids[0])).json();
    const result1 = await (await client.transactions().get(ids[1])).json();
    const result2 = await (await client.transactions().get(ids[2])).json();
    expect(result0.category).toBe("update");
    expect(result1.category).toBe("existing");
    expect(result2.category).toBe("existing");
    done();
  });

  it("works with ID and UID in request body", async (done) => {
    const client = await setup(new TestClient());
    const uid = client.authenticatedUid;
    const id = ids[0];
    const put = {
      uid,
      id,
      integerAmount: 99,
      date: 99,
      comment: "update",
      category: "update",
    };
    await client.transactions().put(id, put);
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid);
    expect(result.category).toBe("update");
    done();
  });

  it("blocks conflicting ID and UID in request body", async (done) => {
    const client = await setup(new TestClient());
    const uid = client.authenticatedUid;
    const id = ids[0];
    const put1 = {
      uid: uuid(),
      id,
      integerAmount: 99,
      date: 99,
      comment: "update",
      category: "update",
    };
    const put2 = {
      uid,
      id: uuid(),
      integerAmount: 99,
      date: 99,
      comment: "update",
      category: "update",
    };
    const response1 = await client.transactions().put(id, put1);
    const response2 = await client.transactions().put(id, put2);
    expect(response1.status).toBeGreaterThanOrEqual(400);
    expect(response2.status).toBeGreaterThanOrEqual(400);
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid);
    expect(result.category).toBe("existing");
    done();
  });

  it.only("can null unrequired fields", async (done) => {
    const client = await setup(new TestClient());
    const uid = client.authenticatedUid;
    const id = ids[0];
    const put = {
      ...existingResources(uid)[0],
      category: "update",
    };
    delete put.comment;
    const response = await client.transactions().put(id, put);
    expect(response.status).toBe(200);
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid);
    expect(result.category).toBe("update");
    expect(result.comment).toBeUndefined();
    done();
  });

  it("blocks requests with invalid data", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const uid = client.authenticatedUid;
    const id = uuid();
    const post = mockTransaction({
      id,
      uid,
      comment: "original",
      category: "c",
      date: 1,
      integerAmount: 10,
    });
    await client.transactions().post(post);

    const invalidPut1 = { ...post, integerAmount: 0.5 };
    const invalidPut2 = { ...post, integerAmount: "string" };
    const invalidPut3 = { ...post, integerAmount: true };
    const invalidPut4 = { ...post, integerAmount: { value: 3 } };
    const invalidPut5 = { ...post, date: "string" };
    const invalidPut6 = { ...post, date: -1 };
    const invalidPut7 = { ...post, date: true };
    const invalidPut8 = { ...post, comment: 4 };
    const invalidPut9 = { ...post, category: 3 };

    const partialPut1 = { ...post, comment: "partial" };
    const partialPut2 = { ...post, comment: "partial" };
    const partialPut3 = { ...post, comment: "partial" };

    delete partialPut1.integerAmount;
    delete partialPut2.category;
    delete partialPut3.date;

    const responseInvalid1 = await client.transactions().put(id, invalidPut1);
    const responseInvalid2 = await client.transactions().put(id, invalidPut2);
    const responseInvalid3 = await client.transactions().put(id, invalidPut3);
    const responseInvalid4 = await client.transactions().put(id, invalidPut4);
    const responseInvalid5 = await client.transactions().put(id, invalidPut5);
    const responseInvalid6 = await client.transactions().put(id, invalidPut6);
    const responseInvalid7 = await client.transactions().put(id, invalidPut7);
    const responseInvalid8 = await client.transactions().put(id, invalidPut8);
    const responseInvalid9 = await client.transactions().put(id, invalidPut9);

    const responsePartial1 = await client.transactions().put(id, partialPut1);
    const responsePartial2 = await client.transactions().put(id, partialPut2);
    const responsePartial3 = await client.transactions().put(id, partialPut3);

    expect(responseInvalid1.status).toBeGreaterThanOrEqual(400);
    expect(responseInvalid2.status).toBeGreaterThanOrEqual(400);
    expect(responseInvalid3.status).toBeGreaterThanOrEqual(400);
    expect(responseInvalid4.status).toBeGreaterThanOrEqual(400);
    expect(responseInvalid5.status).toBeGreaterThanOrEqual(400);
    expect(responseInvalid6.status).toBeGreaterThanOrEqual(400);
    expect(responseInvalid7.status).toBeGreaterThanOrEqual(400);
    expect(responseInvalid8.status).toBeGreaterThanOrEqual(400);
    expect(responseInvalid9.status).toBeGreaterThanOrEqual(400);

    expect(responsePartial1.status).toBeGreaterThanOrEqual(400);
    expect(responsePartial2.status).toBeGreaterThanOrEqual(400);
    expect(responsePartial3.status).toBeGreaterThanOrEqual(400);

    const result = await (await client.transactions().get(id)).json();
    expect(result.integerAmount).toBe(post.integerAmount);
    expect(result.comment).toBe("original");
    done();
  });

  it("cannot modify another user's data", async (done) => {
    const client1 = await setup(new TestClient());
    const client2 = new TestClient();
    const uid1 = client1.authenticatedUid;
    const uid2 = client2.authenticatedUid;
    const id = ids[0];
    const put = {
      comment: "update",
      category: "update",
      integerAmount: 99,
      date: 99,
    };
    const response = await client2.transactions().put(id, put);
    expect(response.status).toBeGreaterThanOrEqual(400);
    const result = await (await client1.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid1);
    expect(result.category).toBe("existing");
    done();
  });
});
