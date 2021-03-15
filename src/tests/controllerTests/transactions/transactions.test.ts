import { TestClient } from "../../TestClient";
import { v4 as uuid } from "uuid";
import { TestUtils } from "../../TestUtils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/transactions/", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("Fails all unauthenticated requests", async (done) => {
    const client = new TestClient();

    // Create fake transaction to use as data for requests
    const body = TestUtils.mockTransaction();

    // Send all requests
    const getAllResponse = await client.transactions().get();
    const getOneResponse = await client.transactions().get(uuid());
    const postResponse = await client.transactions().post(body);
    const putResponse = await client.transactions().put(uuid(), body);
    const patchResponse = await client.transactions().patch(uuid(), body);
    const deleteResponse = await client.transactions().delete(uuid());

    // Expenct 401 unauthenticated status for all requests
    expect(getAllResponse.status).toBe(401);
    expect(getOneResponse.status).toBe(401);
    expect(postResponse.status).toBe(401);
    expect(putResponse.status).toBe(401);
    expect(patchResponse.status).toBe(401);
    expect(deleteResponse.status).toBe(401);

    // Get body for all requests
    const getAllBody = await getAllResponse.json();
    const getOneBody = await getOneResponse.json();
    const postBody = await postResponse.json();
    const putBody = await putResponse.json();
    const patchBody = await patchResponse.json();
    const deleteBody = await deleteResponse.json();

    // Expect all bodies to include code auth/unauthenticated
    expect(getAllBody.code).toBe("auth/unauthenticated");
    expect(getOneBody.code).toBe("auth/unauthenticated");
    expect(postBody.code).toBe("auth/unauthenticated");
    expect(putBody.code).toBe("auth/unauthenticated");
    expect(patchBody.code).toBe("auth/unauthenticated");
    expect(deleteBody.code).toBe("auth/unauthenticated");

    done();
  });

  it("Succesfully creates and fetches transactions", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    // Create n transactions
    const n = 3;

    // Record all transactions' ids
    const ids = [];

    for (let i = 0; i < n; i++) {
      const timestamp = new Date().getTime();

      // Mock a transaction: every second transaction
      // create without comment
      const body = TestUtils.mockTransaction({
        integerAmount: i * 1000,
        category: `category-${i}`,
      });

      if (i % 2 === 0) {
        body.comment = undefined;
      }

      // Post transaction
      const postResponse = await client.transactions().post(body);
      const postBody = await postResponse.json();

      // Get ID from body, check it and record it
      const id = postBody.id;
      expect(id).toBeDefined();
      expect(typeof id).toBe("string");
      ids.push(id);

      // Attempt fetching created transaction again
      const getOneResponse = await client.transactions().get(id);
      const getOneBody = await getOneResponse.json();

      // Check correct parameters posted
      expect(getOneBody.id).toBe(id);
      expect(getOneBody.integerAmount).toBe(i * 1000);
      if (i % 2 === 0) {
        expect(getOneBody.comment).toBeUndefined();
      } else {
        expect(getOneBody.comment).toBeDefined();
      }
      expect(getOneBody.comment).toBe(body.comment);
      expect(getOneBody.time).toBeGreaterThanOrEqual(timestamp);
      expect(getOneBody.createdAt).toBeGreaterThanOrEqual(timestamp);
      expect(getOneBody.category.value).toBe(`category-${i}`);
      expect(getOneBody.category.id).toBeDefined();
    }

    // Attempt fetching all created transactions
    const getAllResponse = await client.transactions().get();
    const getAllBody = await getAllResponse.json();

    // Check response body shape
    expect(getAllBody).toBeDefined();
    expect(getAllBody.t).toBeDefined();
    expect(getAllBody.c).toBeDefined();
    expect(getAllBody.t).toHaveLength(n);
    expect(getAllBody.c).toHaveLength(n);

    // Check all transactions and categories found
    for (let i = 0; i < n; i++) {
      const id = ids[i];
      const transaction = getAllBody.t.find((_: any) => _.id === id);
      const category = getAllBody.c.find((_: any) => _.v === `category-${i}`);
      expect(transaction).toBeDefined();
      expect(category).toBeDefined();
    }

    done();
  });

  it("Cannot create transactions with invalid bodies", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    // Get all invalid bodies
    const invalids = TestUtils.getInvalidTransactionBodies("post");

    // Attempt posting each body and expect a failure
    for (const invalid of invalids) {
      const postResponse = await client.transactions().post(invalid.body);
      expect(postResponse.status).toBe(400);
    }

    // Check no posts were created
    const getAllResponse = await client.transactions().get();
    const getAllBody = await getAllResponse.json();
    expect(getAllBody.t).toHaveLength(0);
    expect(getAllBody.c).toHaveLength(0);

    done();
  });

  it("Succesfully updates transactions", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    // Post transaction and get resulting ID
    const body = TestUtils.mockTransaction({
      integerAmount: 1,
      category: "initial",
      comment: "test",
      time: 1_000_000,
    });
    const postResponse = await client.transactions().post(body);
    const postBody = await postResponse.json();
    const id = postBody.id;
    expect(id).toBeDefined();
    expect(typeof id).toBe("string");

    // Schedule all updates
    const updates = [
      {
        property: "integerAmount",
        value: 2,
        pathToPropertyInResponse: ["integerAmount"],
        propertyShouldBeUndefined: false,
      },
      {
        property: "category",
        value: "updated",
        pathToPropertyInResponse: ["category", "value"],
        propertyShouldBeUndefined: false,
      },
      {
        property: "comment",
        value: "new comment",
        pathToPropertyInResponse: ["comment"],
        propertyShouldBeUndefined: false,
      },
      {
        property: "comment",
        value: null,
        pathToPropertyInResponse: ["comment"],
        propertyShouldBeUndefined: true,
      },
      {
        property: "time",
        value: 2_000_000,
        pathToPropertyInResponse: ["time"],
        propertyShouldBeUndefined: false,
      },
      {
        property: "categoryIcon",
        value: "X",
        pathToPropertyInResponse: ["category", "icon"],
        propertyShouldBeUndefined: false,
      },
    ];

    // Run all updates and check they all succeed
    for (const update of updates) {
      const updateResponse = await client.transactions().patch(id, {
        [update.property]: update.value,
      });
      const updateBody = await updateResponse.json();

      const getOneResponse = await client.transactions().get(id);
      const getOneBody = await getOneResponse.json();

      const valueInUpdated = update.pathToPropertyInResponse.reduce(
        (value, property) => value[property],
        updateBody
      );
      const valueInFetched = update.pathToPropertyInResponse.reduce(
        (value, property) => value[property],
        getOneBody
      );

      if (update.propertyShouldBeUndefined) {
        expect(valueInUpdated).toBeUndefined();
        expect(valueInFetched).toBeUndefined();
      } else {
        expect(valueInUpdated).toBe(update.value);
        expect(valueInFetched).toBe(update.value);
      }
    }

    done();
  });

  it("Succesfully upserts transactions", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const id = uuid();
    const initial = TestUtils.mockTransaction();
    const updated = TestUtils.mockTransaction();

    const initialUpsertResponse = await client.transactions().put(id, initial);
    const initialUpsertBody = await initialUpsertResponse.json();
    const initialGetOneResponse = await client.transactions().get(id);
    const initialGetOneBody = await initialGetOneResponse.json();

    expect(initialUpsertBody.id).toBe(id);
    expect(initialUpsertBody.time).toBe(initial.time);
    expect(initialUpsertBody.comment).toBe(initial.comment);
    expect(initialUpsertBody.integerAmount).toBe(initial.integerAmount);
    expect(initialUpsertBody.category.value).toBe(initial.category);

    expect(initialGetOneBody.id).toBe(id);
    expect(initialGetOneBody.time).toBe(initial.time);
    expect(initialGetOneBody.comment).toBe(initial.comment);
    expect(initialGetOneBody.integerAmount).toBe(initial.integerAmount);
    expect(initialGetOneBody.category.value).toBe(initial.category);

    const updatedUpsertResponse = await client.transactions().put(id, updated);
    const updatedUpsertBody = await updatedUpsertResponse.json();
    const updatedGetOneResponse = await client.transactions().get(id);
    const updatedGetOneBody = await updatedGetOneResponse.json();

    expect(updatedUpsertBody.id).toBe(id);
    expect(updatedUpsertBody.time).toBe(updated.time);
    expect(updatedUpsertBody.comment).toBe(updated.comment);
    expect(updatedUpsertBody.integerAmount).toBe(updated.integerAmount);
    expect(updatedUpsertBody.category.value).toBe(updated.category);

    expect(updatedGetOneBody.id).toBe(id);
    expect(updatedGetOneBody.time).toBe(updated.time);
    expect(updatedGetOneBody.comment).toBe(updated.comment);
    expect(updatedGetOneBody.integerAmount).toBe(updated.integerAmount);
    expect(updatedGetOneBody.category.value).toBe(updated.category);

    done();
  });

  it("Cannot update transactions with invalid bodies", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    // Create one valid transaction
    const validBody = TestUtils.mockTransaction();
    const postResponse = await client.transactions().post(validBody);
    const postBody = await postResponse.json();
    const id = postBody.id;

    // Get all invalid bodies½
    const invalids = TestUtils.getInvalidTransactionBodies("patch");

    // Attempt patching each body and expect a failure
    for (const invalid of invalids) {
      const invalidBody = invalid.body;
      const patchResponse = await client.transactions().patch(id, invalidBody);
      expect(patchResponse.status).toBe(400);
    }

    done();
  });

  it("Cannot upsert transactions with invalid bodies", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    // Create one valid transaction
    const validBody = TestUtils.mockTransaction();
    const postResponse = await client.transactions().post(validBody);
    const postBody = await postResponse.json();
    const id = postBody.id;

    // Get all invalid bodies
    const invalids = TestUtils.getInvalidTransactionBodies("put");

    // Attempt putting each body and expect a failure, both
    // as an update and as an insert
    for (const invalid of invalids) {
      const updateResponse = await client.transactions().put(id, invalid.body);
      const insertResponse = await client
        .transactions()
        .put(uuid(), invalid.body);
      expect(updateResponse.status).toBe(400);
      expect(insertResponse.status).toBe(400);
    }

    // Check only one post was created
    const getAllResponse = await client.transactions().get();
    const getAllBody = await getAllResponse.json();
    expect(getAllBody.t).toHaveLength(1);
    expect(getAllBody.c).toHaveLength(1);

    done();
  });

  it("Succesfully deletes bodies", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const ids = [uuid(), uuid(), uuid(), uuid(), uuid()];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const body = TestUtils.mockTransaction();
      body.integerAmount = i;
      body.category = `category-${i}`;
      await client.transactions().put(id, body);
    }

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];

      const getAllBeforeResponse = await client.transactions().get();
      const getAllBeforeBody = await getAllBeforeResponse.json();
      const transactionBefore = getAllBeforeBody.t.find(
        (_: any) => _.id === id
      );
      expect(getAllBeforeBody.t).toHaveLength(ids.length - i);
      expect(transactionBefore).toBeDefined();
      expect(transactionBefore.a).toBe(i);

      const getOneBeforeResponse = await client.transactions().get(id);
      expect(getOneBeforeResponse.status).toBe(200);

      const deleteResponse = await client.transactions().delete(id);
      const deleteBody = await deleteResponse.json();
      expect(deleteResponse.status).toBe(200);
      expect(deleteBody.id).toBe(id);

      const getOneAfterResponse = await client.transactions().get(id);
      expect(getOneAfterResponse.status).toBe(404);

      const getAllAfterResponse = await client.transactions().get();
      const getAllAfterBody = await getAllAfterResponse.json();
      const transactionAfter = getAllAfterBody.t.find((_: any) => _.id === id);
      expect(getAllAfterBody.t).toHaveLength(ids.length - i - 1);
      expect(transactionAfter).toBeUndefined();
    }

    done();
  });

  it("Cannot fetch, update or delete non-existing data", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const id = uuid();

    const updateResponse = await client.transactions().get(id);
    const getOneResponse = await client.transactions().patch(id, {});
    const deleteResponse = await client.transactions().delete(id);

    expect(updateResponse.status).toBe(404);
    expect(getOneResponse.status).toBe(404);
    expect(deleteResponse.status).toBe(404);

    done();
  });

  it("Cannot fetch, update or delete another user's data", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const foreignClient = new TestClient();
    await foreignClient.authenticate(prisma);

    const id = uuid();

    const body = TestUtils.mockTransaction();

    await foreignClient.transactions().put(id, body);

    const updateResponse = await client.transactions().get(id);
    const upsertResponse = await client.transactions().put(id, body);
    const getOneResponse = await client.transactions().patch(id, {});
    const deleteResponse = await client.transactions().delete(id);

    expect(updateResponse.status).toBe(404);
    expect(upsertResponse.status).toBe(404);
    expect(getOneResponse.status).toBe(404);
    expect(deleteResponse.status).toBe(404);

    done();
  });
});
