import { TestClient } from "../../TestClient";
import { v4 as uuid } from "uuid";
import { mockTransaction } from "../../testUtils";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

describe("/api/transactions/ [GET]", () => {
  beforeAll((done) => prisma.$connect().then(() => done()));
  afterAll((done) => prisma.$disconnect().then(() => done()));

  it("blocks unauthenticated requests", async (done) => {
    const client = new TestClient();
    const response = await client.transactions().get(uuid());
    expect(response.status).toBe(401);
    done();
  });

  it("correctly responds with array of transactions", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);
    const uid = client.authenticatedUid;

    // Mock and create 6 transactions
    const options = [{}, {}, {}, {}, {}, {}];
    const constructables = options.map(() => mockTransaction({ uid }));
    await Promise.all(
      constructables.map((body) => client.transactions().post(body))
    );

    // Get transactions
    const response = await client.transactions().get();
    expect(response.status).toBe(200);

    // Ensure shape
    const body = await response.json();
    expect(body.t).toBeDefined();
    expect(body.c).toBeDefined();
    expect(Array.isArray(body.t)).toBeTruthy();
    expect(Array.isArray(body.c)).toBeTruthy();
    expect(body.t).toHaveLength(6);

    // Ensure all IDs found
    const ids = constructables.map((_) => _.id);
    expect(ids).toContain(body.t[0].id);
    expect(ids).toContain(body.t[1].id);
    expect(ids).toContain(body.t[2].id);
    expect(ids).toContain(body.t[3].id);
    expect(ids).toContain(body.t[4].id);
    expect(ids).toContain(body.t[5].id);

    done();
  });

  it("responds with compressed transactions shape", async (done) => {
    const client = new TestClient();
    await client.authenticate(prisma);

    const transactions = [
      mockTransaction({
        uid: client.authenticatedUid,
        id: uuid(),
        category: "a",
      }),
      mockTransaction({
        uid: client.authenticatedUid,
        id: uuid(),
        category: "b",
      }),
    ];
    await Promise.all(transactions.map((t) => client.transactions().post(t)));

    const response = await client.transactions().get();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.t).toBeDefined();
    expect(body.c).toBeDefined();
    expect(Array.isArray(body.t)).toBeTruthy();
    expect(Array.isArray(body.c)).toBeTruthy();

    const ts = transactions.map((t1) =>
      body.t.find((t2: any) => t2.id === t1.id)
    );
    const cs = ["a", "b"].map((value) =>
      body.c.find((category: any) => category.v === value)
    );
    const full = ts.map((t) => ({
      ...t,
      category: cs.find((_) => _.id === t.cid),
    }));

    expect(ts[0]).toBeDefined();
    expect(ts[1]).toBeDefined();
    expect(cs[0]).toBeDefined();
    expect(cs[1]).toBeDefined();
    expect(full[0]).toBeDefined();
    expect(full[1]).toBeDefined();
    expect(full[0].category).toBeDefined();
    expect(full[1].category).toBeDefined();

    expect(full[0].id).toBe(transactions[0].id);
    expect(full[0].c).toBe(transactions[0].comment);
    expect(full[0].a).toBe(transactions[0].integerAmount);
    expect(full[0].t).toBe(Math.floor(transactions[0].time / 1000));
    expect(full[0].uid).toBeUndefined();
    expect(full[0].category.id).toBeDefined();
    expect(full[0].category.v).toBe(transactions[0].category);
    expect(full[0].category.i).toBeDefined();

    expect(body.t).toHaveLength(2);
    expect(body.c).toHaveLength(2);

    done();
  });

  it("only gets authenticated users' transactions", async (done) => {
    const client1 = new TestClient();
    const client2 = new TestClient();
    await client1.authenticate(prisma);
    await client2.authenticate(prisma);
    const uid1 = client1.authenticatedUid;
    const uid2 = client2.authenticatedUid;

    const ids1 = [uuid(), uuid()];
    const ids2 = [uuid(), uuid(), uuid(), uuid()];

    const constructables1 = ids1.map((id) =>
      mockTransaction({ id, uid: uid1 })
    );
    const constructables2 = ids2.map((id) =>
      mockTransaction({ id, uid: uid2 })
    );

    await Promise.all([
      ...constructables1.map((body) => client1.transactions().post(body)),
      ...constructables2.map((body) => client2.transactions().post(body)),
    ]);

    const response1 = await client1.transactions().get();
    const response2 = await client2.transactions().get();

    const body1 = await response1.json();
    const body2 = await response2.json();

    expect(body1.t).toHaveLength(2);
    expect(body2.t).toHaveLength(4);

    const transaction11 = (body1.t as any[]).find((_) => _.id === ids1[0]);
    const transaction12 = (body1.t as any[]).find((_) => _.id === ids1[1]);
    const transaction21 = (body2.t as any[]).find((_) => _.id === ids2[0]);
    const transaction22 = (body2.t as any[]).find((_) => _.id === ids2[1]);
    const transaction23 = (body2.t as any[]).find((_) => _.id === ids2[2]);
    const transaction24 = (body2.t as any[]).find((_) => _.id === ids2[3]);

    expect(transaction11).toBeDefined();
    expect(transaction12).toBeDefined();
    expect(transaction21).toBeDefined();
    expect(transaction22).toBeDefined();
    expect(transaction23).toBeDefined();
    expect(transaction24).toBeDefined();

    done();
  });
});
