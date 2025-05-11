import { config } from "dotenv";
import { getStats } from "./config/checks";
import { addToDb, StatsData } from "./config/db";
import WebSocket from "ws";
import https from "https";

const agent = new https.Agent({
  rejectUnauthorized: false,
});
config();

function wsConnection() {
  const ws = new WebSocket(process.env.WS_SERVER as string, { agent });

  ws.on("open", () => {
    console.log("WebSocket connected");
  });

  ws.on("message", (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      main(parsed);
    } catch (err) {
      console.error("Invalid data received", );
    }
  });

  ws.on("close", (code) => {
    console.warn(`WebSocket closed . reconnecting...`);
    reconnect();
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
    ws.close();
  });
}

function reconnect(delay = 2000) {
  setTimeout(() => {
    console.log("Attempting to reconnect...");
    wsConnection();
  }, delay);
}

wsConnection();
const currentRegion = process.env.Region;

async function main(data: any) {
  console.log("🚀 ~ Received Data:", data);
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
  console.log("🚀 ~ main ~ finalData:", finalData);

  await addToDb(finalData);
}
