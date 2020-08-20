import { TestClient } from "../../tests/TestClient";
import * as faker from "faker";
import { TransactionConstructable } from "../../entity/transaction.entity";
import { v4 as uuid } from "uuid";
import { TransactionNotFoundError } from "../../errors/TransactionNotFoundError";

function fakeInteger(): number {
  const min = -100000000;
  const max = 100000000;
  return Math.round(min + Math.random() * (max - min));
}

function fakeTransactionConstructable(
  defaults?: Partial<TransactionConstructable>
): TransactionConstructable {
  return {
    id: uuid(),
    uid: uuid(),
    integerAmount: fakeInteger(),
    category: faker.commerce.product(),
    comment: faker.lorem.words(5),
    date: faker.date.past(2).getTime(),
    ...defaults,
  };
}

describe("/api/transactions", () => {
  describe("GET", () => {
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
        fakeTransactionConstructable({ ...opt, uid })
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
        fakeTransactionConstructable({ id, uid: uid1 })
      );
      const constructables2 = ids2.map((id) =>
        fakeTransactionConstructable({ id, uid: uid2 })
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

      expect(1).toBe(1);
      done();
    });
  });

  describe("GET by ID", () => {
    it("blocks unauthenticated requests", async (done) => {
      const client = new TestClient();
      const response = await client.transactions().get();
      expect(response.status).toBe(401);
      done();
    });

    it("returns correct not found error", async (done) => {
      const client = new TestClient();
      await client.authenticate();
      const response = await client.transactions().get(uuid());
      expect(response.status).toBe(400);
      const error = await response.json();
      expect(error.code).toBe(TransactionNotFoundError.code);
      done();
    });

    it("correctly finds created resource", async (done) => {
      const client = new TestClient();
      await client.authenticate();
      const constructable = fakeTransactionConstructable({
        uid: client.authenticatedUid,
      });
      await client.transactions().post(constructable);
      const response = await client.transactions().get(constructable.id!);
      expect(response.status).toBe(200);
      const result = await response.json();
      expect(result.id).toBe(constructable.id);
      expect(result.uid).toBe(client.authenticatedUid);
      expect(result.integerAmount).toBe(constructable.integerAmount);
      expect(result.comment).toBe(constructable.comment);
      expect(result.category).toBe(constructable.category);
      expect(result.date).toBe(constructable.date);
      done();
    });

    it("cannot find another user's resource", async (done) => {
      const client1 = new TestClient();
      const client2 = new TestClient();
      await client1.authenticate();
      await client2.authenticate();

      const constructable = fakeTransactionConstructable({
        uid: client1.authenticatedUid,
      });
      await client1.transactions().post(constructable);

      const response1 = await client1.transactions().get(constructable.id!);
      expect(response1.status).toBe(200);
      const body = await response1.json();
      expect(body.integerAmount).toBe(constructable.integerAmount);

      const response2 = await client2.transactions().get(constructable.id!);
      expect(response2.status).toBe(400);
      const error = await response2.json();
      expect(error.code).toBe(TransactionNotFoundError.code);

      done();
    });
  });

  describe("POST", () => {
    it("blocks unauthenticated requests", async (done) => {
      const client = new TestClient();
      const response = await client.transactions().post(undefined);
      expect(response.status).toBe(401);
      done();
    });

    it("blocks request with invalid data", async (done) => {
      const client = new TestClient();
      await client.authenticate();

      const response1 = await client.transactions().post(null);
      const response2 = await client.transactions().post(undefined);
      const response3 = await client.transactions().post("1");
      const response4 = await client.transactions().post(-1);
      const response5 = await client.transactions().post(true);
      const response6 = await client.transactions().post(() => {});
      const response7 = await client
        .transactions()
        .post([fakeTransactionConstructable()]);

      expect(response1.status).toBe(400);
      expect(response2.status).toBe(400);
      expect(response3.status).toBe(400);
      expect(response4.status).toBe(400);
      expect(response5.status).toBe(400);
      expect(response6.status).toBe(400);
      expect(response7.status).toBe(400);

      done();
    });

    it("blocks requests with invalid UID", async (done) => {
      const client = new TestClient();
      await client.authenticate();
      const constructable = fakeTransactionConstructable();
      const response = await client.transactions().post(constructable);
      expect(response.status).toBe(400);
      done();
    });

    it("blocks requests with missing or invalid integeramount", async (done) => {
      const client = new TestClient();
      await client.authenticate();
      const uid = client.authenticatedUid;

      const constructable1 = fakeTransactionConstructable({ uid }) as any;
      const constructable2 = fakeTransactionConstructable({ uid }) as any;
      const constructable3 = fakeTransactionConstructable({ uid }) as any;
      const constructable4 = fakeTransactionConstructable({ uid }) as any;
      const constructable5 = fakeTransactionConstructable({ uid }) as any;
      const constructable6 = fakeTransactionConstructable({ uid }) as any;

      constructable1.integerAmount = null;
      constructable2.integerAmount = undefined;
      constructable3.integerAmount = 1.05;
      constructable4.integerAmount = "string";
      constructable5.integerAmount = true;
      constructable6.integerAmount = { value: 1 };

      const response1 = await client.transactions().post(constructable1);
      const response2 = await client.transactions().post(constructable2);
      const response3 = await client.transactions().post(constructable3);
      const response4 = await client.transactions().post(constructable4);
      const response5 = await client.transactions().post(constructable5);
      const response6 = await client.transactions().post(constructable6);

      expect(response1.status).toBe(400);
      expect(response2.status).toBe(400);
      expect(response3.status).toBe(400);
      expect(response4.status).toBe(400);
      expect(response5.status).toBe(400);
      expect(response6.status).toBe(400);

      done();
    });

    it("blocks requests with missing or invalid category", async (done) => {
      const client = new TestClient();
      await client.authenticate();
      const uid = client.authenticatedUid;

      const constructable1 = fakeTransactionConstructable({ uid }) as any;
      const constructable2 = fakeTransactionConstructable({ uid }) as any;
      const constructable3 = fakeTransactionConstructable({ uid }) as any;
      const constructable4 = fakeTransactionConstructable({ uid }) as any;
      const constructable5 = fakeTransactionConstructable({ uid }) as any;
      const constructable6 = fakeTransactionConstructable({ uid }) as any;

      constructable1.category = null;
      constructable2.category = undefined;
      constructable3.category = 1.05;
      constructable4.category = "";
      constructable5.category = true;
      constructable6.category = { value: 1 };

      const response1 = await client.transactions().post(constructable1);
      const response2 = await client.transactions().post(constructable2);
      const response3 = await client.transactions().post(constructable3);
      const response4 = await client.transactions().post(constructable4);
      const response5 = await client.transactions().post(constructable5);
      const response6 = await client.transactions().post(constructable6);

      expect(response1.status).toBe(400);
      expect(response2.status).toBe(400);
      expect(response3.status).toBe(400);
      expect(response4.status).toBe(400);
      expect(response5.status).toBe(400);
      expect(response6.status).toBe(400);

      done();
    });

    it("succeeds and creates resource with proper data", async (done) => {
      const client = new TestClient();
      await client.authenticate();
      const constructable = fakeTransactionConstructable({
        uid: client.authenticatedUid,
      });
      const response = await client.transactions().post(constructable);
      expect(response.status).toBe(201);

      const created = await response.json();

      expect(created.uid).toBe(client.authenticatedUid);
      expect(created.id).toBe(constructable.id);
      expect(created.integerAmount).toBe(constructable.integerAmount);
      expect(created.category).toBe(constructable.category);
      expect(created.comment).toBe(constructable.comment);
      expect(created.date).toBe(constructable.date);

      done();
    });

    it("generates UUID and ID for transaction without ID and UID", async (done) => {
      done();
    });
  });

  describe("DELETE", () => {
    it("blocks unauthenticated requests", async (done) => {
      const client = new TestClient();
      const response = await client.transactions().delete("id");
      expect(response.status).toBe(401);
      done();
    });

    it("blocks requests with invalid ID", async (done) => {
      const client = new TestClient();
      await client.authenticate();
      const response = await client.transactions().delete("id");
      expect(response.status).toBe(400);
      done();
    });
  });
});
