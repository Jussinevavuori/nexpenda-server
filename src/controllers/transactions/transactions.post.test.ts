import { TestClient } from "../../tests/TestClient";
import { mockTransactionConstructable } from "../../tests/testUtils";

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
    const response7 = await client
      .transactions()
      .post([mockTransactionConstructable()]);

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
    const constructable = mockTransactionConstructable();
    const response = await client.transactions().post(constructable);
    expect(response.status).toBe(400);
    done();
  });

  it("blocks requests with missing or invalid integeramount", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const uid = client.authenticatedUid;

    const constructable1 = mockTransactionConstructable({ uid }) as any;
    const constructable2 = mockTransactionConstructable({ uid }) as any;
    const constructable3 = mockTransactionConstructable({ uid }) as any;
    const constructable4 = mockTransactionConstructable({ uid }) as any;
    const constructable5 = mockTransactionConstructable({ uid }) as any;
    const constructable6 = mockTransactionConstructable({ uid }) as any;

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

    const constructable1 = mockTransactionConstructable({ uid }) as any;
    const constructable2 = mockTransactionConstructable({ uid }) as any;
    const constructable3 = mockTransactionConstructable({ uid }) as any;
    const constructable4 = mockTransactionConstructable({ uid }) as any;
    const constructable5 = mockTransactionConstructable({ uid }) as any;
    const constructable6 = mockTransactionConstructable({ uid }) as any;

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
    const constructable = mockTransactionConstructable({
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
    const client = new TestClient();
    await client.authenticate();
    const constructable = mockTransactionConstructable();
    delete constructable.id;
    delete constructable.uid;
    const response = await client.transactions().post(constructable);

    expect(response.status).toBe(201);

    const created = await response.json();

    expect(created.uid).toBeDefined();
    expect(created.id).toBeDefined();

    done();
  });
});
