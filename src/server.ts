import * as path from "path";
import * as express from "express";
import * as socketIO from "socket.io";
import * as passport from "passport";
import * as cookieParser from "cookie-parser";
import * as nocache from "nocache";
import * as morgan from "morgan";
import { createServer, Server } from "http";
import {
  pingRouter,
  authRouter,
  transactionsRouter,
  categoriesRouter,
  configurationRouter,
  stripeRouter,
  budgetsRouter,
  profileRouter,
  feedbackRouter,
  logsRouter,
  avatarRouter,
  schedulesRouter,
} from "./controllers";
import { conf } from "./conf";
import { extractAuthentication } from "./middleware/extractAuthentication";
import { PrismaClient } from "@prisma/client";
import { initializeRequestData } from "./middleware/initializeData";
import { handleFailure } from "./middleware/handleFailure";
import { handleErrors } from "./middleware/handleErrors";
import { redirect } from "./utils/redirect";
import { createLogger } from "./utils/createLogger";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { rateLimiters } from "./middleware/rateLimiters";
import { Bucket, Storage } from "@google-cloud/storage";
import { handleMulterErrors } from "./middleware/handleMulterErrors";

/**
 * App logger
 */
const logger = createLogger();

/**
 * All global instances
 */

/**
 * The global Express application
 */
export const app: express.Application = express();

/**
 * The global HTTP server constructed from the Express application. Must
 * be started by the `startServer()` function.
 */
export const http = createServer(app);

/**
 * The global socket IO instance running on top of the HTTP server.
 */
export const io = socketIO(http);

/**
 * The global Prisma instance. Must be connected to the database by
 * `startServer()`.
 */
export let prisma = new PrismaClient();

/**
 * The global server instance. Must be provided by the `startServer()` function.
 */
export let server: undefined | Server;

/**
 * The global Google Cloud Storage instance. Must be provided by the
 * `startServer()` function.
 */
export let storage: Storage;

/**
 * The global Google Cloud Storage bucket. Must be provided by the
 * `startServer()` function.
 */
export let bucket: Bucket;

/**
 * The start server method starts the express application, server and all
 * other global instances such as database and storage.
 */
export function startServer() {
  return new Promise<void>(async (resolve, reject) => {
    try {
      logger("Starting server in", process.env.NODE_ENV, "mode");

      /**
       * Import sockets to configure and use then.
       */
      await require("./socket/socket");
      logger("Websockets configured");

      /**
       * Import passport to use passport.
       */
      await require("./passport");
      logger("Passport configured");

      /**
       * Connect Prisma to database
       */
      await prisma.$connect();
      logger("Connected to database");

      /**
       * Create new Google Cloud Storage and Bucket instance and connect them.
       */
      storage = new Storage({
        keyFilename: path.join(
          __dirname,
          "..",
          conf.google.applicationCredentials
        ),
        projectId: conf.google.projectId,
      });
      bucket = storage.bucket(conf.google.storage.bucketName);
      logger("Connected to storage");

      /**
       * Apply all required middleware.
       */
      app.options("*", corsMiddleware());
      app.use(passport.initialize());
      app.use(cookieParser());
      app.use(express.json({ limit: "10mb" }));
      app.use(corsMiddleware());
      app.use(initializeRequestData());
      app.use(extractAuthentication());
      if (process.env.NODE_ENV !== "test") {
        app.use(morgan("tiny"));
      }
      logger("Configured middleware");

      /**
       * Generic rate limiter
       */
      app.use(rateLimiters.general());

      /**
       * Disable cache.
       */
      app.set("etag", false);
      app.use(nocache());

      /**
       * Apply all api endpoints.
       */
      app.use("/api/ping", pingRouter);
      app.use("/api/auth", authRouter);
      app.use("/api/avatar", avatarRouter);
      app.use("/api/profile", profileRouter);
      app.use("/api/categories", categoriesRouter);
      app.use("/api/transactions", transactionsRouter);
      app.use("/api/budgets", budgetsRouter);
      app.use("/api/schedules", schedulesRouter);
      app.use("/api/config", configurationRouter);
      app.use("/api/stripe", stripeRouter);
      app.use("/api/feedback", feedbackRouter);
      app.use("/api/logs", logsRouter);
      logger("Configured endpoints");

      /**
       * Other endpoints redirect user to app.
       */
      app.use("/", (req, res) => {
        redirect(res).toFrontend("/");
      });

      /**
       * Error handler middlewares. First apply specific error handlers, then
       * generic error handler and last failure handler.
       */
      app.use(handleMulterErrors);
      app.use(handleErrors);
      app.use(handleFailure);

      /**
       * Start server at correct port and resolve when server is active.
       */
      logger("Starting server");
      server = http.listen(conf.port, function () {
        logger(`App is listening on port ${conf.port}`);
        resolve();
      });
    } catch (error) {
      logger("An error occured while starting the server", error);
      reject(error);
    }
  });
}
