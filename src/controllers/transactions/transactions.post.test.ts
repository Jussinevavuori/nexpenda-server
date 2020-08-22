import { TestClient } from "../../tests/TestClient";
import { mockTransaction } from "../../tests/testUtils";

describe("/api/transactions > POST", () => {
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
    const response7 = await client.transactions().post([mockTransaction()]);

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
    const transaction = mockTransaction();
    expect(transaction.uid).toBeDefined();
    expect(transaction.uid).not.toBe(client.authenticatedUid);
    expect(transaction.uid).toBeDefined();
    const response = await client.transactions().post(transaction);
    expect(response.status).toBe(400);
    done();
  });

  it("blocks requests with missing or invalid integeramount", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const uid = client.authenticatedUid;

    const transaction1 = mockTransaction({ uid }) as any;
    const transaction2 = mockTransaction({ uid }) as any;
    const transaction3 = mockTransaction({ uid }) as any;
    const transaction4 = mockTransaction({ uid }) as any;
    const transaction5 = mockTransaction({ uid }) as any;
    const transaction6 = mockTransaction({ uid }) as any;

    transaction1.integerAmount = null;
    transaction2.integerAmount = undefined;
    transaction3.integerAmount = 1.05;
    transaction4.integerAmount = "string";
    transaction5.integerAmount = true;
    transaction6.integerAmount = { value: 1 };

    const response1 = await client.transactions().post(transaction1);
    const response2 = await client.transactions().post(transaction2);
    const response3 = await client.transactions().post(transaction3);
    const response4 = await client.transactions().post(transaction4);
    const response5 = await client.transactions().post(transaction5);
    const response6 = await client.transactions().post(transaction6);

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

    const transaction1 = mockTransaction({ uid }) as any;
    const transaction2 = mockTransaction({ uid }) as any;
    const transaction3 = mockTransaction({ uid }) as any;
    const transaction4 = mockTransaction({ uid }) as any;
    const transaction5 = mockTransaction({ uid }) as any;
    const transaction6 = mockTransaction({ uid }) as any;

    transaction1.category = null;
    transaction2.category = undefined;
    transaction3.category = 1.05;
    transaction4.category = "";
    transaction5.category = true;
    transaction6.category = { value: 1 };

    const response1 = await client.transactions().post(transaction1);
    const response2 = await client.transactions().post(transaction2);
    const response3 = await client.transactions().post(transaction3);
    const response4 = await client.transactions().post(transaction4);
    const response5 = await client.transactions().post(transaction5);
    const response6 = await client.transactions().post(transaction6);

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
    const transaction = mockTransaction({
      uid: client.authenticatedUid,
    });
    const response = await client.transactions().post(transaction);
    expect(response.status).toBe(201);

    const created = await response.json();

    expect(created.uid).toBe(client.authenticatedUid);
    expect(created.id).toBe(transaction.id);
    expect(created.integerAmount).toBe(transaction.integerAmount);
    expect(created.category).toBe(transaction.category);
    expect(created.comment).toBe(transaction.comment);
    expect(created.time).toBe(transaction.time);

    done();
  });

  it("generates UUID and ID for transaction without ID and UID", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const transaction = mockTransaction();
    delete transaction.id;
    delete transaction.uid;
    const response = await client.transactions().post(transaction);

    expect(response.status).toBe(201);

    const created = await response.json();

    expect(created.uid).toBeDefined();
    expect(created.id).toBeDefined();

    done();
  });
});
