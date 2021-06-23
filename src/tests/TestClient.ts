import fetch, { Response } from "node-fetch";
import { conf } from "../conf";
import * as faker from "faker";
import * as jwt from "jsonwebtoken";
import { TestUtils } from "./TestUtils";
import { ConfirmEmailToken } from "../lib/tokens/ConfirmEmailToken";
import { User, PrismaClient } from "@prisma/client";
import { ResetPasswordToken } from "../lib/tokens/ResetPasswordToken";

export class TestClient {
  /**
   * Current server URL
   */
  url: string;

  /**
   * Store current access token, refresh token and authenticated UID as they are fetched
   */
  accessToken?: string;
  refreshToken?: string;
  authenticatedUid?: string;

  defaultTimeout: number;

  /**
   * Initialize with URL
   */
  constructor() {
    this.url = "http://localhost:" + conf.port;
    this.defaultTimeout = 1000;
  }

  /**
   * Automatically generate authentication headers from tokens
   */
  getHeaders(options: { body?: any } = {}) {
    let headers: Record<string, string> = {};
    if (this.accessToken) {
      headers["Authorization"] = `bearer ${this.accessToken}`;
    }
    if (this.refreshToken) {
      const value = `${conf.token.refreshToken.name}=${this.refreshToken};`;
      headers["Cookie"] = value;
    }
    if (options.body) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  }

  /**
   * Endpoint generator
   * if (partials includes __omitapi then "/api" is left out fom URL
   */
  endpoint(...partials: string[]) {
    const fix = (s: string) => (s.startsWith("/") ? s.substring(1) : s);

    let url = this.url;

    if (partials.includes("__omitapi")) {
      url += "/";
    } else {
      url += "/api/";
    }

    for (const partial of partials) {
      if (partial && typeof partial === "string" && partial !== "__omitapi") {
        url += `${fix(partial)}/`;
      }
    }

    return url;
  }

  /**
   * Fetch GET wrapper with automatic auth header and cookies
   */
  async get(
    path: string,
    options: { omitApiInEndpoint?: boolean; timeout?: number } = {}
  ) {
    const endpoint = this.endpoint(
      path,
      options.omitApiInEndpoint === true ? "__omitapi" : ""
    );
    const response = await fetch(endpoint, {
      headers: this.getHeaders(),
      timeout: this.defaultTimeout,
      method: "GET",
    });
    await this.updateRefreshTokenFromResponse(response);
    return response;
  }

  /**
   * Fetch POST wrapper with automatic body, auth header and cookies
   */
  async post(
    path: string,
    body?: any,
    options: { omitApiInEndpoint?: boolean; timeout?: number } = {}
  ) {
    const endpoint = this.endpoint(
      path,
      options.omitApiInEndpoint === true ? "__omitapi" : ""
    );
    const response = await fetch(endpoint, {
      headers: this.getHeaders({ body }),
      timeout: this.defaultTimeout,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    });
    await this.updateRefreshTokenFromResponse(response);
    return response;
  }

  /**
   * Fetch PUT wrapper with automatic body, auth header and cookies
   */
  async put(
    path: string,
    id: string,
    body?: any,
    options: { omitApiInEndpoint?: boolean; timeout?: number } = {}
  ) {
    const endpoint = this.endpoint(
      path,
      id,
      options.omitApiInEndpoint === true ? "__omitapi" : ""
    );

    const response = await fetch(endpoint, {
      headers: this.getHeaders({ body }),
      timeout: this.defaultTimeout,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    });
    await this.updateRefreshTokenFromResponse(response);
    return response;
  }

  /**
   * Fetch PATCH wrapper with automatic body, auth header and cookies
   */
  async patch(
    path: string,
    id: string,
    body?: any,
    options: { omitApiInEndpoint?: boolean; timeout?: number } = {}
  ) {
    const endpoint = this.endpoint(
      path,
      id,
      options.omitApiInEndpoint === true ? "__omitapi" : ""
    );
    const response = await fetch(endpoint, {
      headers: this.getHeaders({ body }),
      timeout: this.defaultTimeout,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    });
    await this.updateRefreshTokenFromResponse(response);
    return response;
  }

  /**
   * Fetch DELETE wrapper with automatic auth header and cookies
   */
  async delete(
    path: string,
    id: string,
    options: { omitApiInEndpoint?: boolean; timeout?: number } = {}
  ) {
    const endpoint = this.endpoint(
      path,
      id,
      options.omitApiInEndpoint === true ? "__omitapi" : ""
    );
    const response = await fetch(endpoint, {
      headers: this.getHeaders(),
      timeout: this.defaultTimeout,
      method: "DELETE",
    });
    await this.updateRefreshTokenFromResponse(response);
    return response;
  }

  /**
   * Fabricates a confirm email token
   */
  fabricateConfirmEmailToken(id: string) {
    return new ConfirmEmailToken({ id } as User).jwt;
  }

  /**
   * Fabricates a reset password token
   */
  async fabricateResetPasswordToken(id: string, prisma: PrismaClient) {
    const userRecord = await prisma.user.findUnique({ where: { id } });
    if (!userRecord) {
      throw Error(
        "Did not find user record for fabricating the reset password token"
      );
    }
    return new ResetPasswordToken(userRecord);
  }

  /**
   * Authentication function: automatically authenticates the client
   * and stores access token, refresh token and authenticated UID data
   */
  async authenticate(prisma: PrismaClient) {
    const email = faker.internet.email();
    const password = faker.internet.password();
    await this.auth().register({ email, password });
    const record = await prisma.user.findUnique({ where: { email } });
    const token = this.fabricateConfirmEmailToken(record!.id);
    await this.auth().confirmEmail(token);
    await this.auth().login({ email, password });
    await this.auth().refreshToken();
    return email;
  }

  /**
   * Ping functions
   */
  ping(options: { protected?: boolean } = {}) {
    const path = options.protected ? "/ping/protected" : "/ping";
    return this.get(path);
  }

  profile() {
    const that = this;
    return {
      get() {
        return that.get("/profile");
      },
      patch(data: any) {
        return that.patch("/profile", "", data);
      },
    };
  }

  avatar() {
    const that = this;
    return {
      put(data: any) {
        return that.put("/avatar", "", data);
      },
    };
  }

  /**
   * All authentication endpoints
   */
  auth() {
    const that = this;
    return {
      login(data: any) {
        return that.post("/auth/login", data);
      },
      register(data: any) {
        return that.post("/auth/register", data);
      },
      logout() {
        return that.post("/auth/logout");
      },
      resetPassword(data: any) {
        return that.post("/auth/reset_password", data);
      },
      confirmEmail(token: string) {
        return that.post(`/auth/confirm_email/${token}`);
      },
      refreshToken() {
        return that.get("/auth/refresh_token").then(async (response) => {
          try {
            const accessToken = await response.text();
            const payload = jwt.decode(accessToken);
            if (accessToken && payload && typeof payload === "object") {
              that.accessToken = accessToken;
            }
          } catch (error) {
            that.accessToken = undefined;
          }
          return response;
        });
      },
      requestConfirmEmail(data: any) {
        return that.post("/auth/request_confirm_email", data);
      },
      changePassword(token: string) {
        return {
          get() {
            return that.get(`/auth/change_password/${token}`);
          },
          post(data: any) {
            return that.post(`/auth/change_password/${token}`, data);
          },
        };
      },
    };
  }

  /**
   * All transaction endpoints
   */
  transactions() {
    const that = this;
    return {
      get(id?: string) {
        return that.get(id ? `/transactions/${id}` : "/transactions");
      },
      post(data: any) {
        return that.post("/transactions", data);
      },
      put(id: any, data: any) {
        return that.put("/transactions", id, data);
      },
      patch(id: any, data: any) {
        return that.patch("/transactions", id, data);
      },
      delete(id: any) {
        return that.delete("/transactions", id);
      },
      massPost(data: any) {
        return that.post("/transactions/mass/post", data, {
          timeout: that.defaultTimeout * 5,
        });
      },
      massDelete(data: any) {
        return that.post("/transactions/mass/delete", data, {
          timeout: that.defaultTimeout * 5,
        });
      },
    };
  }

  /**
   * All budgets endpoints
   */
  budgets() {
    const that = this;
    return {
      get(id?: string) {
        return that.get(id ? `/budgets/${id}` : "/budgets");
      },
      post(data: any) {
        return that.post("/budgets", data);
      },
      put(id: any, data: any) {
        return that.put("/budgets", id, data);
      },
      patch(id: any, data: any) {
        return that.patch("/budgets", id, data);
      },
      delete(id: any) {
        return that.delete("/budgets", id);
      },
    };
  }

  /**
   * All categories endpoints
   */
  categories() {
    const that = this;
    return {
      get() {
        return that.get("/categories");
      },
    };
  }

  /**
   * Helper function to update the refresh token from the response headers
   */
  updateRefreshTokenFromResponse(response: Response) {
    const refreshToken = TestUtils.parseCookieFromResponse(
      response,
      conf.token.refreshToken.name
    );

    if (typeof refreshToken === "string") {
      // Update refresh token
      this.refreshToken = refreshToken;

      // Automatically attempt to parse UID from payload
      const payload = jwt.decode(refreshToken);
      if (
        payload &&
        typeof payload === "object" &&
        payload.uid &&
        typeof payload.uid === "string"
      ) {
        this.authenticatedUid = payload.uid;
      } else {
        this.authenticatedUid = undefined;
      }

      return response;
    }
  }

  async setup(options: {
    transactions?: {
      count: number;
      properties?: {
        integerAmount?: number | ((i: number) => number);
        comment?: string | null | ((i: number) => string | null);
        categoryIcon?: string | null | ((i: number) => string | null);
        category?: string | ((i: number) => string);
        time?: number | ((i: number) => number);
      };
    };
  }) {
    let created = {
      transactions: [] as any[],
    };

    if (options.transactions) {
      for (let i = 0; i < options.transactions.count; i++) {
        const body = TestUtils.mockTransaction();

        if (options.transactions.properties?.integerAmount !== undefined) {
          const value =
            typeof options.transactions.properties.integerAmount === "function"
              ? options.transactions.properties.integerAmount(i)
              : options.transactions.properties.integerAmount;
          body.integerAmount = value;
        }

        if (options.transactions.properties?.category !== undefined) {
          const value =
            typeof options.transactions.properties.category === "function"
              ? options.transactions.properties.category(i)
              : options.transactions.properties.category;
          body.category = value;
        }

        if (options.transactions.properties?.time !== undefined) {
          const value =
            typeof options.transactions.properties.time === "function"
              ? options.transactions.properties.time(i)
              : options.transactions.properties.time;
          body.time = value;
        }

        if (options.transactions.properties?.categoryIcon !== undefined) {
          const value =
            typeof options.transactions.properties.categoryIcon === "function"
              ? options.transactions.properties.categoryIcon(i)
              : options.transactions.properties.categoryIcon;
          if (value === null) {
            body.categoryIcon = undefined;
          } else {
            body.categoryIcon = value;
          }
        }

        if (options.transactions.properties?.comment !== undefined) {
          const value =
            typeof options.transactions.properties.comment === "function"
              ? options.transactions.properties.comment(i)
              : options.transactions.properties.comment;
          if (value === null) {
            body.comment = undefined;
          } else {
            body.comment = value;
          }
        }

        const response = await this.transactions().post(body);
        const transaction = await response.json();
        created.transactions.push(transaction);
      }
    }

    return created;
  }
}
