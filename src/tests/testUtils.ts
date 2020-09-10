import { Response } from "node-fetch";
import { v4 as uuid } from "uuid";
import * as faker from "faker";
import { TestClient } from "./TestClient";
import { PrismaClient } from "@prisma/client";

export const testUtils = {
  parseCookieFromResponse(response: Response, cookieName: string) {
    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) return;
    const cookie = cookies.find((_) => _.startsWith(`${cookieName}=`));
    if (!cookie) return;
    const match = /(rt=)([^;]*)(;.*)/gm.exec(cookie);
    if (!match) return;
    return match[2];
  },
};

export function fakeInteger(): number {
  const min = -100000000;
  const max = 100000000;
  return Math.round(min + Math.random() * (max - min));
}

export async function createTestClientWithTransactions(prisma: PrismaClient) {
  const client = new TestClient();
  await client.authenticate(prisma);
  const uid = client.authenticatedUid;
  const ids = [uuid(), uuid(), uuid(), uuid(), uuid()] as const;
  const posts = ids.map((id, index) => {
    return mockTransaction({
      integerAmount: index + 1,
      comment: `resource ${index + 1}`,
      category: "existing",
      time: index + 1,
      id,
      uid,
    });
  });
  await Promise.all(posts.map((post) => client.transactions().post(post)));
  return { client, uid, ids, posts };
}

export function mockTransaction(
  defaults?: Partial<
    {
      id: any;
      uid: any;
      integerAmount: any;
      category: any;
      comment: any;
      time: any;
    } & Record<string, any>
  >,
  remove?: Partial<{
    id: boolean;
    uid: boolean;
    integerAmount: boolean;
    category: boolean;
    comment: boolean;
    time: boolean;
  }>
) {
  const object = {
    id: uuid(),
    uid: uuid(),
    integerAmount: fakeInteger(),
    category: faker.commerce.product(),
    comment: faker.lorem.words(5),
    time: faker.date.past(2).getTime(),
  };

  if (remove) {
    if (remove.id) {
      delete object.id;
    }
    if (remove.uid) {
      delete object.uid;
    }
    if (remove.integerAmount) {
      delete object.integerAmount;
    }
    if (remove.category) {
      delete object.category;
    }
    if (remove.comment) {
      delete object.comment;
    }
    if (remove.time) {
      delete object.time;
    }
  }

  return { ...object, ...defaults };
}
