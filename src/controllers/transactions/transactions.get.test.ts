import { TestClient } from "../../tests/TestClient";
import { v4 as uuid } from "uuid";
import { mockTransaction } from "../../tests/testUtils";

describe("/api/transactions > GET", () => {
  it("blocks unauthenticated requests", async (done) => {
    const client = new TestClient();
    const response = await client.transactions().get(uuid());
    expect(response.status).toBe(401);
    done();
  });

  it("correctly responds with array of transactions in chronological order", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const uid = client.authenticatedUid;

    const options = [
      { id: uuid(), date: 2 },
      { id: uuid(), date: 1 },
      { id: uuid(), date: 6 },
      { id: uuid(), date: 3 },
      { id: uuid(), date: 5 },
      { id: uuid(), date: 8 },
    ];

    const constructables = options.map((opt) =>
      mockTransaction({ ...opt, uid })
    );

    await Promise.all(
      constructables.map((body) => client.transactions().post(body))
    );

    const response = await client.transactions().get();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body).toHaveLength(6);

    const sorted = options.sort((a, b) => a.date - b.date);

    expect(body[0].id).toBe(sorted[0].id);
    expect(body[1].id).toBe(sorted[1].id);
    expect(body[2].id).toBe(sorted[2].id);
    expect(body[3].id).toBe(sorted[3].id);
    expect(body[4].id).toBe(sorted[4].id);
    expect(body[5].id).toBe(sorted[5].id);

    done();
  });

  it("only gets authenticated users' transactions", async (done) => {
    const client1 = new TestClient();
    const client2 = new TestClient();
    await client1.authenticate();
    await client2.authenticate();
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

    expect(body1).toHaveLength(2);
    expect(body2).toHaveLength(4);

    const transaction11 = (body1 as any[]).find((_) => _.id === ids1[0]);
    const transaction12 = (body1 as any[]).find((_) => _.id === ids1[1]);
    const transaction21 = (body2 as any[]).find((_) => _.id === ids2[0]);
    const transaction22 = (body2 as any[]).find((_) => _.id === ids2[1]);
    const transaction23 = (body2 as any[]).find((_) => _.id === ids2[2]);
    const transaction24 = (body2 as any[]).find((_) => _.id === ids2[3]);

    expect(transaction11).toBeDefined();
    expect(transaction12).toBeDefined();
    expect(transaction21).toBeDefined();
    expect(transaction22).toBeDefined();
    expect(transaction23).toBeDefined();
    expect(transaction24).toBeDefined();

    done();
  });
});
