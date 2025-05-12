import { config } from "dotenv";
import WebSocket from "ws";
config();
import https from "https";
import { logger } from "./logs";



export async function pushToStats(data: { urlId: string; url: string }) {
  const agent = new https.Agent({
    rejectUnauthorized: false,
  });


  const ws = new WebSocket(process.env.WS_SERVER as string, { agent });
  logger.info("Pushed to queue ", data.urlId);

  
  ws.onopen = () => {
    ws.send(JSON.stringify(data));
    ws.close();
  };

  ws.onerror = () => {
    logger.error("🚀 ~ pushToStats ~ error:");
  };
}
