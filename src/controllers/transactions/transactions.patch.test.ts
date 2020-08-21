import { TestClient } from "../../tests/TestClient";
import { v4 as uuid } from "uuid";
import { mockTransaction } from "../../tests/testUtils";

describe("/api/transactions > PATCH", () => {
  it("blocks unauthorized requests", async (done) => {
    const client = new TestClient();
    const id = uuid();
    const constructable = mockTransaction();
    const response = await client.transactions().patch(id, constructable);
    expect(response.status).toBe(401);
    done();
  });

  it("cannot patch when no transaction is found", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const uid = client.authenticatedUid;
    const id = uuid();
    const constructable = mockTransaction({ id, uid });
    await client.transactions().patch(id, constructable);
    done();
  });

  it("allows authorized requests with proper data", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const uid = client.authenticatedUid;
    const id = uuid();
    const constructable1 = mockTransaction({
      id,
      uid,
      integerAmount: 1,
    });
    const constructable2 = mockTransaction({
      id,
      uid,
      integerAmount: 2,
    });
    await client.transactions().post(constructable1);
    const before = await (await client.transactions().get(id)).json();
    expect(before.integerAmount).toBe(1);
    const response = await client.transactions().patch(id, constructable2);
    expect(response.status).toBe(200);
    const after = await (await client.transactions().get(id)).json();
    expect(after.integerAmount).toBe(2);
    expect(before.id).toBe(after.id);
    done();
  });

  it("can patch with missing ID or UID", async (done) => {
    const client = new TestClient();
    done();
  });

  it("cannot patch with invalid ID or UID", async (done) => {
    const client = new TestClient();
    done();
  });

  it("blocks requests with invalid data", async (done) => {
    const client = new TestClient();
    done();
  });

  it("cannot modify another user's data", async (done) => {
    const client = new TestClient();
    done();
  });
});
