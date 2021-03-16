import { TestClient } from "../../TestClient";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/categories", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("Blocks unauthenticated requests", async (done) => {
    const client = new TestClient();
    const response = await client.categories().get();
    expect(response.status).toBe(401);
    done();
  });

  it("Returns empty list on authenticated request", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);
    const response = await client.categories().get();
    const categories = await response.json();
    expect(categories).toHaveLength(0);
    done();
  });

  it("Returns correct categories on authenticated requests", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    // Setup n categories
    const n = 4;

    // Set up client with n categories from category-1 to category-n
    const setup = await client.setup({
      transactions: {
        count: 10,
        properties: {
          category: (i) => `category-${(i % n) + 1}`,
        },
      },
    });

    // Get all unique created category IDs
    const createdCategoryIds = setup.transactions
      .map((_) => _.category.id)
      .filter((id, i, a) => a.indexOf(id) === i);
    expect(createdCategoryIds).toHaveLength(n);

    // Get all unique created category names
    const createdCategoryNames = setup.transactions
      .map((_) => _.category.value)
      .filter((name, i, a) => a.indexOf(name) === i);
    expect(createdCategoryNames).toHaveLength(n);

    // Fetch n categories
    const getResponse = await client.categories().get();
    const getBody = await getResponse.json();
    expect(getResponse.status).toBe(200);
    expect(getBody).toHaveLength(n);

    // Ensure all categories present by name
    for (const name of createdCategoryNames) {
      const categoriesWithName = getBody.filter((_: any) => _.value === name);
      expect(categoriesWithName.length).toBeGreaterThan(0);
    }

    // Ensure all categories present by ID
    for (const id of createdCategoryIds) {
      const categoriesWithId = getBody.filter((_: any) => _.id === id);
      expect(categoriesWithId.length).toBeGreaterThan(0);
    }

    done();
  });
});
