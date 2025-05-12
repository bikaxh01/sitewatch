import { config } from "dotenv";
import { getStats } from "./config/checks";
import { addToDb, StatsData } from "./config/db";
import WebSocket from "ws";
import https from "https";
import { logger } from "./config/logger";

const agent = new https.Agent({
  rejectUnauthorized: false,
});
config();

function wsConnection() {
  const ws = new WebSocket(process.env.WS_SERVER as string, { agent });

  ws.on("open", () => {
    logger.info("WebSocket connected");

    const pingInterval = setInterval(() => {
      console.log("Sending ping to all connected clients...");
      ws.send("ping");
    }, 30000);
  });

  ws.on("message", (data) => {
    console.log("🚀 ~ ws.on ~ data:", data.toString());

    const msg = data.toString();
    if (msg == "pong") {
      console.log("🚀 ~ ws.on ~ pong:", msg);
    }

    try {
      const parsed = JSON.parse(data.toString());
      main(parsed);
    } catch (err) {
      logger.error("Invalid data received");
    }
  });

  ws.on("close", (code) => {
    logger.warn(`WebSocket closed . reconnecting...`);
    reconnect();
  });

  ws.on("error", (err) => {
    logger.error("WebSocket error:", err);
    ws.close();
  });
}

function reconnect(delay = 2000) {
  setTimeout(() => {
    logger.info("Attempting to reconnect...");
    wsConnection();
  }, delay);
}

wsConnection();
const currentRegion = process.env.Region;

async function main(data: any) {
  logger.info("🚀 ~ Received Data:", data);
  if (!data) {
    console.log("No data received.");
    return;
  }

  const urlId = data.urlId;
  const url = data.url;
  const statsResult = await getStats(url);

  if (!currentRegion) {
    console.log("Invalid region 🔴");
    process.exit(0);
    return;
  }

  const finalData: StatsData = {
    dataTransfer: statsResult.start_transfer,
    nameLookup: statsResult.name_lookup,
    region: currentRegion,
    tcpConnection: statsResult.tcp_connection,
    tlsHandshake: statsResult.tls_handshake,
    totalTime: statsResult.total_time,
    url: url,
    urlId: urlId,
  };

  await addToDb(finalData);
}
