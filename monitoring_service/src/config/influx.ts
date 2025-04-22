import { InfluxDBClient, Point } from "@influxdata/influxdb3-client";
import { config } from "dotenv";
config()

const token = process.env.INFLUXDB_TOKEN;
const host = process.env.INFLUXDB_HOST;
const bucket = process.env.INFLUX_BUCKET;
let database = bucket;

export interface MonitorData {
  urlId: string;
  url: string;
  ping_avg: number;
  ping_min: number;
  ping_max: number;
  http_status: string;
}
export async function addToDb({
  urlId,
  url,
  ping_avg,
  ping_max,
  ping_min,
  http_status,
}: MonitorData) {
    
  const client = new InfluxDBClient({ host: host!, token: token });
  const data = Point.measurement("monitoring_stats")
    .setTag("urlId", urlId)
    .setTag("url", url)
    .setFloatField("ping_avg", ping_avg)
    .setFloatField("ping_max", ping_max)
    .setFloatField("ping_min", ping_min)
    .setField("http_status", http_status)
    .setField("created_at", Date.now());

 await client.write(data, database);


  client.close();
}
