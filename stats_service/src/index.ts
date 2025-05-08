import { config } from "dotenv";
import { getStats } from "./config/checks";
import { addToDb, StatsData } from "./config/db";
import WebSocket from "ws";

const ws = new WebSocket("ws://localhost:8000");

ws.on("message", (data) => {
  const obj = data.toString();
  const parsedData = JSON.parse(obj);
  main(parsedData);
});

config();

const currentRegion = process.env.Region;

// subscribe topic
// get data
// parse data

async function main(data: any) {
  console.log("🚀 ~ main ~ data:", data)
  if (!data) {
    console.log("No data received.");
    return;
  }
  
  const urlId = data.data;
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

