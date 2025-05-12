import { InfluxDBClient } from "@influxdata/influxdb3-client";
import { Sql } from "@prisma/client/runtime/library";
import { formatTime } from "./db";

const token = process.env.INFLUXDB_TOKEN!;
const host = process.env.INFLUXDB_HOST!;
const bucket = process.env.INFLUX_BUCKET!;
let database = bucket;

const client = new InfluxDBClient({
  host: host!,
  token: token,
  database: database,
});

export async function lastChecked(urlId: string) {
  const query = `
      SELECT * FROM "monitoring_stats"
  WHERE "urlId" = '${urlId}'
  ORDER BY time DESC
  LIMIT 1
    `;

  const data = await client.query(query, bucket);

  for await (const row of data) {
    return row;
  }
}

export interface StatsParams {
  urlId: string;
  days: "24h" | "30d" | "7d";
  region: "Europe" | "ASIA (JAPAN)";
}

export async function getUrlStat({ days, region, urlId }: StatsParams) {
  const query = `
  SELECT * FROM "monitoring_stats"
  WHERE "urlId" = '${urlId}'  AND "region" = '${region}'  AND time >= now() - interval '${days}'
  ORDER BY time DESC
`;

  const data = await client.query(query, bucket);
  const statsData = [];

  for await (const row of data) {
    const formattedRow = {
      time: row.time,
      data_transfer: row.data_transfer,
      name_lookup: row.name_lookup,
      region: row.region,
      tcp_connection: row.tcp_connection,
      tls_handshake: row.tls_handshake,
      total_time: row.total_time,
    };

    statsData.push(formattedRow);
  }

  return statsData;
}
