import { TestClient } from "../../tests/TestClient";
import { v4 as uuid } from "uuid";
import { mockTransactionConstructable } from "../../tests/testUtils";
import { TransactionNotFoundError } from "../../errors/TransactionNotFoundError";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

describe("/api/transactions > GET by ID", () => {
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
    const constructable = mockTransactionConstructable({
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

    const constructable = mockTransactionConstructable({
      uid: client1.authenticatedUid,
    });
    await client1.transactions().post(constructable);

    const response1 = await client1.transactions().get(constructable.id!);
    expect(response1.status).toBe(200);
    const body = await response1.json();
    expect(body.integerAmount).toBe(constructable.integerAmount);

    const response2 = await client2.transactions().get(constructable.id!);
    expect(response2.status).toBe(UnauthorizedError.status);
    const error = await response2.json();
    expect(error.code).toBe(UnauthorizedError.code);

    done();
  });
});
