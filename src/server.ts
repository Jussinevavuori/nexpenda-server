import "reflect-metadata";
import * as express from "express";
import { createServer, Server } from "http";
import * as socketIO from "socket.io";
import * as passport from "passport";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
// import * as path from "path";
import { createConnection, getConnectionOptions, Connection } from "typeorm";
import { pingRouter, authRouter, transactionsRouter } from "./controllers";
import { conf } from "./conf";
import { handleApplicationError } from "./middleware/handleApplicationError";
import { extractAuthentication } from "./middleware/extractAuthentication";

export const app: express.Application = express();
export const http = createServer(app);
export const io = socketIO(http);
export let connection: undefined | Connection;
export let server: undefined | Server;

export function startServer() {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("Starting server in", process.env.NODE_ENV, "mode");

      // Import configurations
      await require("./socket/socket");
      await require("./passport");

      // Connect with TypeORM to PSQL database
      const connectionOptions = await getConnectionOptions(
        process.env.NODE_ENV
      );
      connection = await createConnection({
        ...connectionOptions,
        name: "default",
      });

      // Middleware
      app.use(passport.initialize());
      app.use(cookieParser());
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(cors());
      app.use(extractAuthentication());

      // Api endpoints
      app.use("/api/ping", pingRouter);
      app.use("/api/auth", authRouter);
      app.use("/api/transactions", transactionsRouter);

      // Serve latest React app build at all unmatching endpoints
      // app.use("/", (req, res) => {
      //   res.sendFile("index.html", {
      //     root: path.join(__dirname, "..", "..", "client", "build"),
      //   });
      // });

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
