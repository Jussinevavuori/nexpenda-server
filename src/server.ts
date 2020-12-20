import * as express from "express";
import * as socketIO from "socket.io";
import * as passport from "passport";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import { createServer, Server } from "http";
import { pingRouter, authRouter, transactionsRouter } from "./controllers";
import { conf } from "./conf";
import { extractAuthentication } from "./middleware/extractAuthentication";
import { PrismaClient } from "@prisma/client";
import { initializeRequestData } from "./middleware/initializeData";
import { handleFailure } from "./middleware/handleFailure";
import { handleErrors } from "./middleware/handleErrors";
import { redirect } from "./utils/redirect";
import { createLogger } from "./utils/createLogger";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { rateLimiter } from "./middleware/RateLimiter";

const logger = createLogger();

export const app: express.Application = express();
export const http = createServer(app);
export const io = socketIO(http);
export let prisma = new PrismaClient();
export let server: undefined | Server;

export function startServer() {
  return new Promise<void>(async (resolve, reject) => {
    try {
      logger("Starting server in", process.env.NODE_ENV, "mode");

      // Import configurations
      await require("./socket/socket");
      logger("Websockets configured");

      await require("./passport");
      logger("Passport configured");

      // Connect to DB
      await prisma.$connect();
      logger("Connected to database");

      // Middleware
      // app.use(requireHttps({ ignoreHosts: [/localhost/] }));
      app.options("*", corsMiddleware());
      app.use(passport.initialize());
      app.use(cookieParser());
      app.use(bodyParser.json({ limit: "10mb" }));
      app.use(corsMiddleware());
      app.use(initializeRequestData());
      app.use(extractAuthentication());
      logger("Configured middleware");

      // Rate limit
      app.use(rateLimiter.general());

      // Disable cache
      app.use((req, res, next) => {
        res.set("Cache-Control", "no-store");
        next();
      });

      app.use((req, res, next) => {
        const user = req.data.auth.user;
        if (!user) {
          logger(
            `Unauthenticated request received <${req.data.auth.noUserReason}> to ${req.path}`
          );
        } else {
          logger(`Request from ${user.email} <${user.id}> to ${req.path}`);
          logger(`> Access token ${req.data.auth.accessToken}`);
          logger(`> Refresh token ${req.data.auth.refreshToken}`);
        }
        next();
      });

      // Api endpoints
      app.use("/api/ping", pingRouter);
      app.use("/api/auth", authRouter);
      app.use("/api/transactions", transactionsRouter);
      logger("Configured endpoints");

      // Redirect users who navigate to backend URl
      app.use("/", (req, res) => {
        redirect(res).toFrontend("/");
      });

      // Error handler middlewares
      app.use(handleErrors);
      app.use(handleFailure);

      // Start server
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
