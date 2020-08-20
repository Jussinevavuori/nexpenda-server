import { io } from "../server";

function log(...args: any[]) {
  console.log("/transactions:", ...args);
}

const nsp = io.of("/transactions");

nsp.on("connection", (socket) => {
  log("User connected");

  socket.on("disconnect", () => {
    log("User disconnected");
  });
});

// setInterval(() => {
//   const integerAmount = Math.floor(2 * (Math.random() - 0.5) * 100000);
//   const date = Date.now();
//   const uid = "1";
//   nsp.emit("transactions/created", {
//     uid,
//     integerAmount,
//     date,
//     category: "test",
//   });
//   log("Created transaction for", integerAmount);
// }, 5000);
