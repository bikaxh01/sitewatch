import { InfluxDBClient, Point } from "@influxdata/influxdb3-client";
import { config } from "dotenv";
config();

const token = process.env.INFLUXDB_TOKEN;
const host = process.env.INFLUXDB_HOST;
const bucket = process.env.INFLUX_BUCKET;

export interface StatsData {
  urlId: string;
  url: string;
  tcpConnection: number;
  nameLookup: number;
  tlsHandshake: number;
  dataTransfer: number;
  totalTime: number;
  region: string;
}
export async function addToDb({
  urlId,
  url,
  tcpConnection,
  dataTransfer,
  nameLookup,
  tlsHandshake,
  totalTime,
  region,
}: StatsData) {
  try {
    const client = new InfluxDBClient({ host: host!, token: token });

    const data = Point.measurement("monitoring_stats")
      .setTag("urlId", urlId)
      .setTag("url", url)
      .setTag("region", region)
      .setFloatField("tcp_connection", tcpConnection)
      .setFloatField("name_lookup", nameLookup)
      .setFloatField("tls_handshake", tlsHandshake)
      .setFloatField("data_transfer", dataTransfer)
      .setFloatField("total_time", totalTime);

    const res = await client.write(data, bucket);

    client.close();
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
}
