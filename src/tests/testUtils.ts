import { Response } from "node-fetch";
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

export function mockTransaction(
  defaults?: Partial<
    {
      id: any;
      uid: any;
      integerAmount: any;
      category: any;
      comment: any;
      date: any;
    } & Record<string, any>
  >,
  remove?: Partial<{
    id: boolean;
    uid: boolean;
    integerAmount: boolean;
    category: boolean;
    comment: boolean;
    date: boolean;
  }>
) {
  const object = {
    id: uuid(),
    uid: uuid(),
    integerAmount: fakeInteger(),
    category: faker.commerce.product(),
    comment: faker.lorem.words(5),
    date: faker.date.past(2).getTime(),
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
    if (remove.date) {
      delete object.date;
    }
  }

  return { ...object, ...defaults };
}
