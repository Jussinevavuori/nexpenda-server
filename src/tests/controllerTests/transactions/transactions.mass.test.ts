import { TestClient } from "../../TestClient";
import { TestUtils } from "../../TestUtils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/transactions/mass/", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("Can succesfully mass post and delete transactions", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const bodies = Array.from({ length: 10 }).map((_, i) => {
      return TestUtils.mockTransaction({ integerAmount: i });
    });

    const massPostResponse = await client.transactions().massPost({
      transactions: bodies,
    });
    const massPostBody = await massPostResponse.json();
    expect(massPostResponse.status).toBe(201);
    expect(massPostBody.t).toBeDefined();
    expect(massPostBody.c).toBeDefined();
    expect(massPostBody.t).toHaveLength(bodies.length);

    const getAllResponse = await client.transactions().get();
    const getAllBody = await getAllResponse.json();
    expect(getAllBody.t).toBeDefined();
    expect(getAllBody.c).toBeDefined();
    expect(getAllBody.t).toHaveLength(bodies.length);
    expect(getAllBody.c).toHaveLength(massPostBody.c.length);

    const ids = massPostBody.t.map((_: any) => _.id);

    const massDeleteResponse = await client.transactions().massDelete({ ids });
    const massDeleteBody = await massDeleteResponse.json();
    expect(massDeleteResponse.status).toBe(200);
    expect(massDeleteBody.deletedCount).toBe(bodies.length);

    const getAllAfterResponse = await client.transactions().get();
    const getAllAfterBody = await getAllAfterResponse.json();
    expect(getAllAfterBody.t).toHaveLength(0);

    done();
  });
});
