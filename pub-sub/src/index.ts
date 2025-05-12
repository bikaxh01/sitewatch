import { logger } from "./logger";
import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8000 });

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  logger.info("User connected");

  // const pingInterval = setInterval(() => {
  //   console.log("Sending ping to client");
  //   ws.send("ping");
  // }, 3000);

  ws.on("message", function message(data, isBinary) {
    if (data.toString() === "ping") {
      ws.send("pong");
    }

    wss.clients.forEach(function each(client) {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(data, { binary: isBinary });
      }
    });
  });
});
