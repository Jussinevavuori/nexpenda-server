import { TestClient } from "../../tests/TestClient";
import { v4 as uuid } from "uuid";
import {
  mockTransaction,
  createTestClientWithTransactions,
} from "../../tests/testUtils";
import { PrismaClient } from "@prisma/client";

describe("/api/transactions > PATCH", () => {
  const prisma = new PrismaClient();

  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("blocks unauthorized requests", async (done) => {
    const client = new TestClient();
    const id = uuid();
    const patch = mockTransaction();
    const response = await client.transactions().patch(id, patch);
    expect(response.status).toBe(401);
    done();
  });

  it("cannot patch when no transaction is found", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);
    const uid = client.authenticatedUid;
    const id = uuid();
    const patch = mockTransaction({ id, uid });
    const response = await client.transactions().patch(id, patch);
    expect(response.status).toBeGreaterThanOrEqual(400);
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBeUndefined();
    done();
  });

  it("can fully update existing resouce", async (done) => {
    const { client, uid, ids } = await createTestClientWithTransactions(prisma);
    const id = ids[0];
    const patch = {
      id,
      uid,
      integerAmount: 99,
      time: 99,
      comment: "update",
      category: "update",
    };
    await client.transactions().put(id, patch);
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid);
    expect(result.integerAmount).toBe(99);
    expect(result.time).toBe(99);
    expect(result.comment).toBe("update");
    expect(result.category).toBe("update");
    done();
  });

  it("can patch with missing ID or UID", async (done) => {
    const { client, uid, ids } = await createTestClientWithTransactions(prisma);
    const id = ids[0];
    const patch = {
      integerAmount: 99,
      time: 99,
      comment: "update",
      category: "update",
    };
    const response = await client.transactions().patch(id, patch);
    expect(response.status).toBe(200);
    const updated = await response.json();
    expect(updated.id).toBe(id);
    expect(updated.uid).toBe(uid);
    expect(updated.integerAmount).toBe(99);
    expect(updated.time).toBe(99);
    expect(updated.comment).toBe("update");
    expect(updated.category).toBe("update");
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid);
    expect(result.integerAmount).toBe(99);
    expect(result.time).toBe(99);
    expect(result.comment).toBe("update");
    expect(result.category).toBe("update");
    done();
  });

  it("cannot patch with invalid ID or UID", async (done) => {
    const { client, uid, ids } = await createTestClientWithTransactions(prisma);
    const id = ids[0];
    const patch1 = {
      id: uuid(),
      uid,
      integerAmount: 99,
      time: 99,
      comment: "update",
      category: "update",
    };
    const patch2 = {
      id,
      uid: uuid(),
      integerAmount: 99,
      time: 99,
      comment: "update",
      category: "update",
    };
    const response1 = await client.transactions().patch(id, patch1);
    const response2 = await client.transactions().patch(id, patch2);
    expect(response1.status).toBe(400);
    expect(response2.status).toBe(400);
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid);
    expect(result.integerAmount).not.toBe(99);
    expect(result.time).not.toBe(99);
    expect(result.comment).not.toBe("update");
    expect(result.category).not.toBe("update");
    done();
  });

  it("can partially update fields", async (done) => {
    const { client, uid, ids } = await createTestClientWithTransactions(prisma);
    const id = ids[0];
    const patch1 = { integerAmount: 99 };
    const patch2 = { time: 99 };
    const patch3 = { comment: "update" };
    const patch4 = { category: "update" };
    const response1 = await client.transactions().patch(id, patch1);
    const response2 = await client.transactions().patch(id, patch2);
    const response3 = await client.transactions().patch(id, patch3);
    const response4 = await client.transactions().patch(id, patch4);
    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    expect(response3.status).toBe(200);
    expect(response4.status).toBe(200);
    const updated1 = await response1.json();
    const updated2 = await response2.json();
    const updated3 = await response3.json();
    const updated4 = await response4.json();
    expect(updated1.integerAmount).toBe(99);
    expect(updated1.time).not.toBe(99);
    expect(updated2.time).toBe(99);
    expect(updated2.comment).not.toBe("update");
    expect(updated3.comment).toBe("update");
    expect(updated3.category).not.toBe("update");
    expect(updated4.category).toBe("update");
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid);
    expect(result.integerAmount).toBe(99);
    expect(result.time).toBe(99);
    expect(result.comment).toBe("update");
    expect(result.category).toBe("update");
    done();
  });

  it("can partially null fields", async (done) => {
    const { client, uid, ids } = await createTestClientWithTransactions(prisma);
    const id = ids[0];
    const patch = { comment: null };
    const response = await client.transactions().patch(id, patch);
    expect(response.status).toBe(200);
    const updated = await response.json();
    expect(updated.id).toBe(id);
    expect(updated.uid).toBe(uid);
    expect(updated.comment).toBeUndefined();
    const result = await (await client.transactions().get(id)).json();
    expect(result.id).toBe(id);
    expect(result.uid).toBe(uid);
    expect(result.comment).toBeUndefined();
    done();
  });

  it("cannot modify another user's data", async (done) => {
    const { ["client"]: client1, ids } = await createTestClientWithTransactions(
      prisma
    );
    const client2 = new TestClient();
    await client2.authenticate(prisma);
    const id = ids[0];
    const patch = { category: "unauthorized" };
    const response = await client2.transactions().patch(id, patch);
    expect(response.status).toBe(404);
    const result = await (await client1.transactions().get(id)).json();
    expect(result.category).not.toBe("unauthorized");
    done();
  });
});
