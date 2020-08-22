import fetch, { Response } from "node-fetch";
import { conf } from "../conf";
import * as faker from "faker";
import * as jwt from "jsonwebtoken";
import { testUtils } from "./testUtils";

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
  getHeaders(options?: { body?: any }) {
    let headers: Record<string, string> = {};
    if (this.accessToken) {
      headers["Authorization"] = this.accessToken;
    }
    if (this.refreshToken) {
      const value = `${conf.token.refreshToken.name}=${this.refreshToken};`;
      headers["Cookie"] = value;
    }
    if (options?.body) {
      headers["Content-Type"] = "application/json";
    }
    return headers;
  }

  /**
   * Endpoint generator
   */
  endpoint(path: string, ...partials: string[]) {
    const fix = (s: string) => (s.startsWith("/") ? s.substring(1) : s);
    return [
      this.url,
      "api",
      fix(path),
      ...partials.filter((_) => typeof _ === "string").map(fix),
    ].join("/");
  }

  /**
   * Fetch GET wrapper with automatic auth header and cookies
   */
  async get(path: string) {
    const response = await fetch(this.endpoint(path), {
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
  async post(path: string, body?: any) {
    const response = await fetch(this.endpoint(path), {
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
  async put(path: string, id: string, body?: any) {
    const response = await fetch(this.endpoint(path, id), {
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
  async patch(path: string, id: string, body?: any) {
    const response = await fetch(this.endpoint(path, id), {
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
  async delete(path: string, id: string) {
    const response = await fetch(this.endpoint(path, id), {
      headers: this.getHeaders(),
      timeout: this.defaultTimeout,
      method: "DELETE",
    });
    await this.updateRefreshTokenFromResponse(response);
    return response;
  }

  /**
   * Authentication function: automatically authenticates the client
   * and stores access token, refresh token and authenticated UID data
   */
  async authenticate() {
    const email = faker.internet.email();
    const password = faker.internet.password();
    await this.auth().register({ email, password });
    await this.auth().refreshToken();
    return email;
  }

  /**
   * Ping functions
   */
  ping(options?: { protected?: boolean }) {
    const path = options?.protected ? "/ping/protected" : "/ping";
    return this.get(path);
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
        return that.get("/auth/logout");
      },
      profile() {
        return that.get("/auth/profile");
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
    };
  }

  /**
   * Helper function to update the refresh token from the response headers
   */
  updateRefreshTokenFromResponse(response: Response) {
    const refreshToken = testUtils.parseCookieFromResponse(
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
}
