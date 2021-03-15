import { TestClient } from "../../TestClient";
import { v4 as uuid } from "uuid";
import { TestUtils } from "../../TestUtils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/budgets/", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("Fails all unauthenticated requests", async (done) => {
    const client = new TestClient();

    // Create fake transaction to use as data for requests
    const body = TestUtils.mockBudget();

    // Send all requests
    const getAllResponse = await client.budgets().get();
    const getOneResponse = await client.budgets().get(uuid());
    const postResponse = await client.budgets().post(body);
    const putResponse = await client.budgets().put(uuid(), body);
    const patchResponse = await client.budgets().patch(uuid(), body);
    const deleteResponse = await client.budgets().delete(uuid());

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

  it("Succesfully creates and fetches budgets", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const setup = await client.setup({
      transactions: {
        count: 5,
        properties: {
          category: (i) => i.toString(),
        },
      },
    });
    const categoryIds = setup.transactions.map((_) => _.category.id);

    // Create n budgets
    const n = 3;

    // Record all budgets' ids
    const ids = [];

    for (let i = 0; i < n; i++) {
      const timestamp = new Date().getTime();

      // Mock a budget: every second budget create without label
      const body = TestUtils.mockBudget({
        integerAmount: i * 1000,
        categoryIds: categoryIds.filter(
          (_, i) => i === 0 || Math.random() < 0.5
        ),
      });
      if (i % 2 === 0) {
        body.label = undefined;
      }

      // Post budget
      const postResponse = await client.budgets().post(body);
      const postBody = await postResponse.json();

      // Get ID from body, check it and record it
      const id = postBody.id;
      expect(id).toBeDefined();
      expect(typeof id).toBe("string");
      ids.push(id);

      // Attempt fetching created budget again
      const getOneResponse = await client.budgets().get(id);
      const getOneBody = await getOneResponse.json();

      // Check correct parameters posted
      expect(getOneBody.id).toBe(id);
      expect(getOneBody.integerAmount).toBe(i * 1000);
      if (i % 2 === 0) {
        expect(getOneBody.label).toBeUndefined();
      } else {
        expect(getOneBody.label).toBeDefined();
        expect(getOneBody.label).toBe(body.label);
      }
      expect(getOneBody.createdAt).toBeGreaterThanOrEqual(timestamp);
      expect(getOneBody.categoryIds).toHaveLength(body.categoryIds.length);
    }

    // Attempt fetching all created budgets
    const getAllResponse = await client.budgets().get();
    const getAllBody = await getAllResponse.json();

    // Check response body contains all budgets
    expect(getAllBody).toBeDefined();
    expect(getAllBody).toHaveLength(n);

    done();
  });

  it("Cannot create budgets with invalid bodies", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    // Get all invalid bodies
    const invalids = TestUtils.getInvalidBudgetBodies("post");

    // Attempt posting each body and expect a failure
    for (const invalid of invalids) {
      const postResponse = await client.budgets().post(invalid.body);
      expect(postResponse.status).toBe(400);
    }

    // Check no posts were created
    const getAllResponse = await client.budgets().get();
    const getAllBody = await getAllResponse.json();
    expect(getAllBody).toHaveLength(0);

    done();
  });

  it("Succesfully updates transactions", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const setup = await client.setup({
      transactions: {
        count: 5,
        properties: {
          category: (i) => `c-${i}`,
        },
      },
    });

    const categoryIds = setup.transactions.map((_) => _.category.id);

    // Post transaction and get resulting ID
    const body = TestUtils.mockBudget({
      integerAmount: 1,
      label: "Test",
      categoryIds,
    });
    const postResponse = await client.budgets().post(body);
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
        property: "categoryIds",
        value: categoryIds.filter((_, i) => i % 2 === 0),
        pathToPropertyInResponse: ["categoryIds"],
        propertyShouldBeUndefined: false,
      },
      {
        property: "label",
        value: "new label",
        pathToPropertyInResponse: ["label"],
        propertyShouldBeUndefined: false,
      },
      {
        property: "label",
        value: null,
        pathToPropertyInResponse: ["label"],
        propertyShouldBeUndefined: true,
      },
    ];

    // Run all updates and check they all succeed
    for (const update of updates) {
      const updateResponse = await client.budgets().patch(id, {
        [update.property]: update.value,
      });
      const updateBody = await updateResponse.json();

      const getOneResponse = await client.budgets().get(id);
      const getOneBody = await getOneResponse.json();

      const valueInUpdated = update.pathToPropertyInResponse.reduce(
        (value, property) => value[property],
        updateBody
      );
      const valueInFetched = update.pathToPropertyInResponse.reduce(
        (value, property) => value[property],
        getOneBody
      );

      if (Array.isArray(update.value)) {
        expect(valueInFetched).toHaveLength(update.value.length);
        expect(valueInUpdated).toHaveLength(update.value.length);
        for (let entry of update.value) {
          expect(valueInFetched).toContain(entry);
          expect(valueInUpdated).toContain(entry);
        }
      } else if (update.propertyShouldBeUndefined) {
        expect(valueInUpdated).toBeUndefined();
        expect(valueInFetched).toBeUndefined();
      } else {
        expect(valueInUpdated).toBe(update.value);
        expect(valueInFetched).toBe(update.value);
      }
    }

    done();
  });

  it("Succesfully upserts budgets", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const setup = await client.setup({
      transactions: {
        count: 5,
        properties: {
          category: (i) => i.toString(),
        },
      },
    });
    const categoryIds = setup.transactions.map((_) => _.category.id);

    const id = uuid();
    const initial = TestUtils.mockBudget();
    initial.categoryIds = categoryIds.filter(
      (_, i) => i === 0 || Math.random() < 0.5
    );
    const updated = TestUtils.mockBudget();
    updated.categoryIds = categoryIds.filter(
      (_, i) => i === 0 || Math.random() < 0.5
    );

    const initialUpsertResponse = await client.budgets().put(id, initial);
    const initialUpsertBody = await initialUpsertResponse.json();
    const initialGetOneResponse = await client.budgets().get(id);
    const initialGetOneBody = await initialGetOneResponse.json();

    expect(initialUpsertBody.id).toBe(id);
    expect(initialUpsertBody.label).toBe(initial.label);
    expect(initialUpsertBody.integerAmount).toBe(initial.integerAmount);
    expect(initialUpsertBody.categoryIds).toHaveLength(
      initial.categoryIds.length
    );

    expect(initialGetOneBody.id).toBe(id);
    expect(initialGetOneBody.label).toBe(initial.label);
    expect(initialGetOneBody.integerAmount).toBe(initial.integerAmount);
    expect(initialGetOneBody.categoryIds).toHaveLength(
      initial.categoryIds.length
    );
    const updatedUpsertResponse = await client.budgets().put(id, updated);
    const updatedUpsertBody = await updatedUpsertResponse.json();
    const updatedGetOneResponse = await client.budgets().get(id);
    const updatedGetOneBody = await updatedGetOneResponse.json();

    expect(updatedUpsertBody.id).toBe(id);
    expect(updatedUpsertBody.label).toBe(updated.label);
    expect(updatedUpsertBody.integerAmount).toBe(updated.integerAmount);
    expect(updatedUpsertBody.categoryIds).toHaveLength(
      updated.categoryIds.length
    );

    expect(updatedGetOneBody.id).toBe(id);
    expect(updatedGetOneBody.label).toBe(updated.label);
    expect(updatedGetOneBody.integerAmount).toBe(updated.integerAmount);
    expect(updatedGetOneBody.categoryIds).toHaveLength(
      updated.categoryIds.length
    );

    done();
  });

  it("Cannot update budgets with invalid bodies", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    // Create one valid budget
    const validBody = TestUtils.mockBudget();
    const postResponse = await client.budgets().post(validBody);
    const postBody = await postResponse.json();
    const id = postBody.id;

    // Get all invalid bodies½
    const invalids = TestUtils.getInvalidBudgetBodies("patch");

    // Attempt patching each body and expect a failure
    for (const invalid of invalids) {
      const patchResponse = await client.budgets().patch(id, invalid.body);
      expect(patchResponse.status).toBe(400);
    }

    done();
  });

  it("Cannot upsert budgets with invalid bodies", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    // Create one valid budget
    const validBody = TestUtils.mockBudget();
    const postResponse = await client.budgets().post(validBody);
    const postBody = await postResponse.json();
    const id = postBody.id;

    // Get all invalid bodies
    const invalids = TestUtils.getInvalidBudgetBodies("put");

    // Attempt putting each body and expect a failure, both
    // as an update and as an insert
    for (const invalid of invalids) {
      const updateResponse = await client.budgets().put(id, invalid.body);
      const insertResponse = await client.budgets().put(uuid(), invalid.body);
      expect(updateResponse.status).toBe(400);
      expect(insertResponse.status).toBe(400);
    }

    // Check only one post was created
    const getAllResponse = await client.budgets().get();
    const getAllBody = await getAllResponse.json();
    expect(getAllBody).toHaveLength(1);

    done();
  });

  it("Succesfully deletes bodies", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const ids = [uuid(), uuid(), uuid(), uuid(), uuid()];
    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];
      const body = TestUtils.mockBudget();
      body.integerAmount = i;
      await client.budgets().put(id, body);
    }

    for (let i = 0; i < ids.length; i++) {
      const id = ids[i];

      const getAllBeforeResponse = await client.budgets().get();
      const getAllBeforeBody = await getAllBeforeResponse.json();
      const budgetBefore = getAllBeforeBody.find((_: any) => _.id === id);
      expect(getAllBeforeBody).toHaveLength(ids.length - i);
      expect(budgetBefore).toBeDefined();
      expect(budgetBefore.integerAmount).toBe(i);

      const getOneBeforeResponse = await client.budgets().get(id);
      expect(getOneBeforeResponse.status).toBe(200);

      const deleteResponse = await client.budgets().delete(id);
      const deleteBody = await deleteResponse.json();
      expect(deleteResponse.status).toBe(200);
      expect(deleteBody.id).toBe(id);

      const getOneAfterResponse = await client.budgets().get(id);
      expect(getOneAfterResponse.status).toBe(404);

      const getAllAfterResponse = await client.budgets().get();
      const getAllAfterBody = await getAllAfterResponse.json();
      const budgetAfter = getAllAfterBody.find((_: any) => _.id === id);
      expect(getAllAfterBody).toHaveLength(ids.length - i - 1);
      expect(budgetAfter).toBeUndefined();
    }

    done();
  });

  it("Cannot fetch, update or delete non-existing data", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const id = uuid();

    const updateResponse = await client.budgets().get(id);
    const getOneResponse = await client.budgets().patch(id, {});
    const deleteResponse = await client.budgets().delete(id);

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

    const body = TestUtils.mockBudget();

    await foreignClient.budgets().put(id, body);

    const updateResponse = await client.budgets().get(id);
    const upsertResponse = await client.budgets().put(id, body);
    const getOneResponse = await client.budgets().patch(id, {});
    const deleteResponse = await client.budgets().delete(id);

    expect(updateResponse.status).toBe(404);
    expect(upsertResponse.status).toBe(404);
    expect(getOneResponse.status).toBe(404);
    expect(deleteResponse.status).toBe(404);

    done();
  });
});
