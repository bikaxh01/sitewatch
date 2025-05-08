import { config } from "dotenv";
import WebSocket from "ws";
config();
export async function pushToStats(data: { urlId: string; url: string }) {
  //connect to websocket

  const ws = new WebSocket(process.env.WS_SERVER as string);

  ws.onopen = () => {
    ws.send(JSON.stringify(data));
    ws.close();
  };

  ws.onerror = () => {
    console.log("🚀 ~ pushToStats ~ error:");
  };
}
