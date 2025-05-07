import { InfluxDBClient, Point } from "@influxdata/influxdb3-client";
import { config } from "dotenv";
config();

const token = process.env.INFLUXDB_TOKEN;
const host = process.env.INFLUXDB_HOST;
const bucket = process.env.INFLUX_BUCKET;
let database = bucket;

export interface StatsData {
  urlId: string;
  url: string;
  tcpConnection: number;
  nameLookup: number;
  tlsHandshake: number;
  dataTransfer: number;
  totalTime: number;
}
export async function addToDb({
  urlId,
  url,
  tcpConnection,
  dataTransfer,
  nameLookup,
  tlsHandshake,
  totalTime
}: StatsData) {
  const client = new InfluxDBClient({ host: host!, token: token });
  const data = Point.measurement("monitoring_stats")
    .setTag("urlId", urlId)
    .setTag("url", url)
    .setFloatField("tcp_connection",tcpConnection )
    .setFloatField("name_lookup", nameLookup)
    .setFloatField("tls_handshake", tlsHandshake)
    .setFloatField("data_transfer", dataTransfer)
    .setField("total_time", totalTime);

  await client.write(data, database);

  client.close();
}
