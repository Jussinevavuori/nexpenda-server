import { pingRouter } from "../../routers";

/**
 * Ping route test
 */
pingRouter.get("/", async (req, res) => {
  res.send("pong");
});
