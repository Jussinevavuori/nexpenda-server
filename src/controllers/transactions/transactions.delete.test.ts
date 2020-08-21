import { TestClient } from "../../tests/TestClient";
import { mockTransactionConstructable } from "../../tests/testUtils";
import { v4 as uuid } from "uuid";

describe("/api/transactions > DELETE", () => {
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

  it("deletes own resources", async (done) => {
    const client = new TestClient();
    await client.authenticate();
    const uid = client.authenticatedUid;
    const ids = [uuid(), uuid(), uuid()];
    await Promise.all(
      ids.map((id) =>
        client.transactions().post(mockTransactionConstructable({ id, uid }))
      )
    );
    const before = await (await client.transactions().get()).json();
    expect(before).toHaveLength(3);
    expect(before.find((_: any) => _.id === ids[0])).toBeDefined();
    expect(before.find((_: any) => _.id === ids[1])).toBeDefined();
    expect(before.find((_: any) => _.id === ids[2])).toBeDefined();

    const response = await client.transactions().delete(ids[0]);
    expect(response.status).toBe(204);

    const after = await (await client.transactions().get()).json();
    expect(after.find((_: any) => _.id === ids[0])).toBeUndefined();
    expect(after.find((_: any) => _.id === ids[1])).toBeDefined();
    expect(after.find((_: any) => _.id === ids[2])).toBeDefined();
    done();
  });

  it("cannot delete other people's resources", async (done) => {
    const client1 = new TestClient();
    const client2 = new TestClient();
    await client1.authenticate();
    await client2.authenticate();
    const uid = client1.authenticatedUid;
    const id = uuid();
    await client1
      .transactions()
      .post(mockTransactionConstructable({ id, uid }));
    const response1 = await (await client1.transactions().get()).json();
    expect(response1).toHaveLength(1);

    const unauthorizedResponse = await client2.transactions().delete(id);
    expect(unauthorizedResponse.status).toBeGreaterThanOrEqual(400);

    const response2 = await (await client1.transactions().get()).json();
    expect(response2).toHaveLength(1);

    const authorizedResponse = await client1.transactions().delete(id);
    expect(authorizedResponse.status).toBe(204);

    const response3 = await (await client1.transactions().get()).json();
    expect(response3).toHaveLength(0);
    done();
  });
});
