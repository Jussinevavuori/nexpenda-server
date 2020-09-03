import * as express from "express";
import { createServer, Server } from "http";
import * as socketIO from "socket.io";
import * as passport from "passport";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import {
  pingRouter,
  authRouter,
  transactionsRouter,
  pagesRouter,
} from "./controllers";
import { conf } from "./conf";
import { handleApplicationError } from "./middleware/handleApplicationError";
import { extractAuthentication } from "./middleware/extractAuthentication";
import { PrismaClient } from "@prisma/client";
import { initializeRequestData } from "./middleware/initializeData";

export const app: express.Application = express();
export const http = createServer(app);
export const io = socketIO(http);
export let prisma = new PrismaClient();
export let server: undefined | Server;

export function startServer() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Starting server in", process.env.NODE_ENV, "mode");

      // Import configurations
      await require("./socket/socket");
      await require("./passport");

      // Connect to DB
      await prisma.$connect();

      // Middleware
      app.use(passport.initialize());
      app.use(cookieParser());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(
        cors({
          credentials: true,
          origin: ["http://localhost:3000", "https://expenceapp.herokuapp.com"],
        })
      );
      app.use(initializeRequestData());
      app.use(extractAuthentication());

      // Api endpoints
      app.use("/", pagesRouter);
      app.use("/api/ping", pingRouter);
      app.use("/api/auth", authRouter);
      app.use("/api/transactions", transactionsRouter);

      app.use(express.static(path.join(__dirname, "..", "build")));

      app.use((req, res) => {
        res.sendFile("index.html", {
          root: path.join(__dirname, "..", "build"),
        });
      });

      // Error handler middlewares
      app.use(handleApplicationError);

      // Start server
      server = http.listen(conf.port, function () {
        console.log(`App is listening on port ${conf.port}`);
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
