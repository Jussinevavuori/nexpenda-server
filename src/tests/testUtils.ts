import { Response } from "node-fetch";
import { v4 as uuid } from "uuid";
import * as faker from "faker";

export class TestUtils {
  static parseCookieFromResponse(response: Response, cookieName: string) {
    const cookies = response.headers.raw()["set-cookie"];
    if (!cookies) return;
    const cookie = cookies.find((_) => _.startsWith(`${cookieName}=`));
    if (!cookie) return;
    const match = /(rt=)([^;]*)(;.*)/gm.exec(cookie);
    if (!match) return;
    return match[2];
  }

  static fakeInteger(options: { min?: number; max?: number } = {}): number {
    const min = options.min ?? -100000000;
    const max = options.max ?? 100000000;
    return Math.round(min + Math.random() * (max - min));
  }

  static mockBudget(
    defaults: Partial<{
      label: any;
      integerAmount: any;
      categoryIds: any;
    }> = {}
  ) {
    return {
      label: defaults.label ?? faker.commerce.productName(),
      integerAmount: defaults.integerAmount ?? TestUtils.fakeInteger(),
      categoryIds: defaults.categoryIds ?? [],
    };
  }

  static mockTransaction(
    defaults: Partial<{
      integerAmount?: any;
      category?: any;
      comment?: any;
      time?: any;
      categoryIcon?: string;
    }> = {}
  ) {
    return {
      integerAmount: defaults.integerAmount ?? TestUtils.fakeInteger(),
      category: defaults.category ?? faker.commerce.productMaterial(),
      comment: defaults.comment ?? faker.commerce.product(),
      time: defaults.time ?? new Date().getTime(),
      categoryIcon: defaults.categoryIcon ?? undefined,
    };
  }

  static getInvalidBudgetBodies(method: "post" | "patch" | "put") {
    function getValid() {
      return {
        integerAmount: 1000,
        category: "valid category",
        comment: "valid comment",
        time: new Date().getTime(),
      };
    }
    const invalidBudgets = [
      {
        methods: ["post", "put"],
        reason: "Undefined body",
        body: (body: any) => {
          return undefined;
        },
      },
      {
        methods: ["post", "put"],
        reason: "Null body",
        body: (body: any) => {
          return null;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "Numeric body",
        body: (body: any) => {
          return 9999;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "String body",
        body: (body: any) => {
          return "99999";
        },
      },
      {
        methods: ["post", "put"],
        reason: "Body is empty",
        body: (body: any) => {
          return {};
        },
      },
      {
        methods: ["post", "put"],
        reason: "No integer amount",
        body: (body: any) => {
          delete body.integerAmount;
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "No label",
        body: (body: any) => {
          delete body.label;
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "No category ids",
        body: (body: any) => {
          delete body.categoryIds;
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "CategoryIds is string",
        body: (body: any) => {
          body.categoryIds = "test";
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "CategoryIds is number",
        body: (body: any) => {
          body.categoryIds = 894835;
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "CategoryIds is number array",
        body: (body: any) => {
          body.categoryIds = [1, 2, 3, 4, 5];
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "CategoryIds is null",
        body: (body: any) => {
          body.categoryIds = null;
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "Label is a number",
        body: (body: any) => {
          body.categoryIds = 20;
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "Label is null",
        body: (body: any) => {
          body.label = null;
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "IntegerAmount is a string",
        body: (body: any) => {
          body.integerAmount = "test";
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "IntegerAmount is null",
        body: (body: any) => {
          body.integerAmount = null;
          return body;
        },
      },
    ];

    return invalidBudgets
      .filter((_) => _.methods.includes(method))
      .map((_) => ({ ..._, body: _.body(getValid()) }));
  }

  static getInvalidTransactionBodies(method: "post" | "patch" | "put") {
    function getValid() {
      return {
        integerAmount: 1000,
        category: "valid category",
        comment: "valid comment",
        time: new Date().getTime(),
      };
    }

    const invalidTransactions = [
      {
        methods: ["post", "put"],
        reason: "Undefined body",
        body: (body: any) => {
          return undefined;
        },
      },
      {
        methods: ["post", "put"],
        reason: "Null body",
        body: (body: any) => {
          return null;
        },
      },
      {
        methods: ["post", "put"],
        reason: "Empty body",
        body: (body: any) => {
          return {};
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "Numeric body",
        body: (body: any) => {
          return 9999;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "String body",
        body: (body: any) => {
          return "invalid";
        },
      },
      {
        methods: ["post", "put"],
        reason: "No category",
        body: (body: any) => {
          delete body.category;
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "No integerAmount",
        body: (body: any) => {
          delete body.integerAmount;
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "No time",
        body: (body: any) => {
          delete body.time;
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "Non-integer integerAmount",
        body: (body: any) => {
          body.integerAmount = 1999.5;
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "Contains extra field",
        body: (body: any) => {
          body.extraField = "extraValue";
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "Contains an UID",
        body: (body: any) => {
          body.uid = uuid();
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "Contains an ID",
        body: (body: any) => {
          body.id = uuid();
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "time is null",
        body: (body: any) => {
          body.time = null;
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "integerAmount is null",
        body: (body: any) => {
          body.integerAmount = null;
          return body;
        },
      },
      {
        methods: ["post", "put", "patch"],
        reason: "category is null",
        body: (body: any) => {
          body.category = null;
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "comment is null",
        body: (body: any) => {
          body.comment = null;
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "integerAmount is a string",
        body: (body: any) => {
          body.integerAmount = "10000";
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "time is a string",
        body: (body: any) => {
          body.time = "29483853454";
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "category is a number",
        body: (body: any) => {
          body.category = 140932;
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "category icon is null",
        body: (body: any) => {
          body.categoryIcon = null;
          return body;
        },
      },
      {
        methods: ["post", "put"],
        reason: "category icon is number",
        body: (body: any) => {
          body.categoryIcon = 123458;
          return body;
        },
      },
    ];

    return invalidTransactions
      .filter((_) => _.methods.includes(method))
      .map((_) => ({ ..._, body: _.body(getValid()) }));
  }
}
