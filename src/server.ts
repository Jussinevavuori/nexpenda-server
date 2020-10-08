import * as express from "express";
import * as socketIO from "socket.io";
import * as passport from "passport";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import { createServer, Server } from "http";
import { pingRouter, authRouter, transactionsRouter } from "./controllers";
import { conf } from "./conf";
import { extractAuthentication } from "./middleware/extractAuthentication";
import { PrismaClient } from "@prisma/client";
import { initializeRequestData } from "./middleware/initializeData";
import { handleFailure } from "./middleware/handleFailure";
import { handleErrors } from "./middleware/handleErrors";
import { requireHttps } from "./middleware/requireHttps";
import { redirect } from "./utils/redirect";
import { createLogger } from "./utils/createLogger";

const logger = createLogger();

export const app: express.Application = express();
export const http = createServer(app);
export const io = socketIO(http);
export let prisma = new PrismaClient();
export let server: undefined | Server;

export function startServer() {
  return new Promise(async (resolve, reject) => {
    try {
      logger("Starting server in", process.env.NODE_ENV, "mode");

      // Import configurations
      await require("./socket/socket");
      logger("Websockets configured");

      await require("./passport");
      logger("Passport configured");

      // Connect to DB
      logger("Configuring Prisma client");
      await prisma.$connect();
      logger("Connected to database:", process.env.DATABASE_URL);

      // Middleware
      app.use(requireHttps({ ignoreHosts: [/localhost/] }));
      logger("Configured middleware: requireHttps");
      app.use(passport.initialize());
      logger("Configured middleware: passport");
      app.use(cookieParser());
      logger("Configured middleware: cookieParser");
      app.use(bodyParser.json());
      logger("Configured middleware: bodyParser");
      app.use(
        cors({
          credentials: true,
          origin: function (origin, callback) {
            callback(null, true);
            // const whitelist = [
            //   "http://localhost:3000",
            //   "http://localhost:4000",
            //   "https://expenceapp.herokuapp.com",
            //   "https://expence.vercel.app",
            // ];
            // if (origin && whitelist.includes(origin)) {
            //   callback(null, true);
            // } else {
            //   callback(new Error("Cors failure"));
            // }
          },
        })
      );
      logger("Configured middleware: cors");
      app.use(initializeRequestData());
      logger("Configured middleware: initializeRequestData");
      app.use(extractAuthentication());
      logger("Configured middleware: extractAuthentication");

      // Api endpoints
      app.use("/api/ping", pingRouter);
      logger("Initialized endpoints: /api/ping");
      app.use("/api/auth", authRouter);
      logger("Initialized endpoints: /api/auth");
      app.use("/api/transactions", transactionsRouter);
      logger("Initialized endpoints: /api/transactions");

      // Redirect users who navigate to backend URl
      app.use("/", (req, res) => {
        redirect(res).toFrontend("/");
      });
      logger("Initialized endpoints: Frontend redirection at root");

      // Error handler middlewares
      app.use(handleErrors);
      logger("Initialized error handler");
      app.use(handleFailure);
      logger("Initialized failure handler");

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
