import { Router, Request, Response, NextFunction } from "express";
import { User } from "@prisma/client";
import { Result } from "./Result";
import { UnauthenticatedFailure } from "./Failures";

type Resolver = (
  request: Request,
  response: Response
) => void | Result<any> | Promise<void | Result<any>>;

type ProtectedResolver = (
  user: User,
  request: Request,
  response: Response
) => void | Result<any> | Promise<void | Result<any>>;

/**
 * Route wrapper for easier syntax and protected routes, where
 * errors are handled by returning Results.
 */
export class Route {
  readonly router: Router;
  readonly route: string;

  /**
   * Construct a Route object for a router and a route
   */
  constructor(router: Router, route: string) {
    this.router = router;
    this.route = route;
  }

  /**
   * Wrap resolver in automatic error handling
   */
  private createResolver(resolver: Resolver) {
    return async (request: Request, response: Response, next: NextFunction) => {
      const result = await resolver(request, response);
      if (result && result.isFailure()) {
        next(result);
      } else if (result && result.isSuccess() && !response.headersSent) {
        response.send(result.value);
      }
    };
  }

  /**
   * Wrap resolver in automatic error handling, protect protected routes
   * and provide user
   */
  private createProtectedResolver(resolver: ProtectedResolver) {
    return async (request: Request, response: Response, next: NextFunction) => {
      // Ensure authentication
      if (!request.data.user) {
        return next(new UnauthenticatedFailure());
      }

      const result = await resolver(request.data.user, request, response);
      if (result && result.isFailure()) {
        next(result);
      } else if (result && result.isSuccess() && !response.headersSent) {
        response.send(result.value);
      }
    };
  }

  /**
   * Create a get method for the route
   */
  get(resolver: Resolver) {
    const fullResolver = this.createResolver(resolver);
    this.router.get(this.route, fullResolver);
  }

  /**
   * Create a post method for the route
   */
  post(resolver: Resolver) {
    const fullResolver = this.createResolver(resolver);
    this.router.post(this.route, fullResolver);
  }

  /**
   * Create a patch method for the route
   */
  patch(resolver: Resolver) {
    const fullResolver = this.createResolver(resolver);
    this.router.patch(this.route, fullResolver);
  }

  /**
   * Create a put method for the route
   */
  put(resolver: Resolver) {
    const fullResolver = this.createResolver(resolver);
    this.router.put(this.route, fullResolver);
  }

  /**
   * Create a delete method for the route
   */
  delete(resolver: Resolver) {
    const fullResolver = this.createResolver(resolver);
    this.router.delete(this.route, fullResolver);
  }

  /**
   * Protected routes
   */
  get protected() {
    const that = this;

    return {
      /**
       * Create a get method for the route
       */
      get(resolver: ProtectedResolver) {
        const fullResolver = that.createProtectedResolver(resolver);
        that.router.get(that.route, fullResolver);
      },

      /**
       * Create a post method for the route
       */
      post(resolver: ProtectedResolver) {
        const fullResolver = that.createProtectedResolver(resolver);
        that.router.post(that.route, fullResolver);
      },

      /**
       * Create a patch method for the route
       */
      patch(resolver: ProtectedResolver) {
        const fullResolver = that.createProtectedResolver(resolver);
        that.router.patch(that.route, fullResolver);
      },

      /**
       * Create a put method for the route
       */
      put(resolver: ProtectedResolver) {
        const fullResolver = that.createProtectedResolver(resolver);
        that.router.put(that.route, fullResolver);
      },

      /**
       * Create a delete method for the route
       */
      delete(resolver: ProtectedResolver) {
        const fullResolver = that.createProtectedResolver(resolver);
        that.router.delete(that.route, fullResolver);
      },
    };
  }
}
