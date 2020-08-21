import { Response } from "node-fetch";
import { TransactionConstructable } from "../entity/transaction.entity";
import { v4 as uuid } from "uuid";
import * as faker from "faker";

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

export function mockTransactionConstructable(
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
