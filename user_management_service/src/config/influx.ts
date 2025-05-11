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

  // const data = await client.query(query, bucket);

  // for await (const row of data) {
  //   return row;
  // }
  return { time: Date.now() };
}

export async function getUrlStat(urlId: string) {
  const query = `
  SELECT * FROM "monitoring_stats"
  WHERE "urlId" = '${urlId}' AND time >= now() - interval '24 hours'
`;
  const data = await client.query(query, bucket);
  const statsData = [];

  for await (const row of data) {
    const formattedRow = {
      time: formatTime(row.time),
      max: row.ping_max,
      avg: row.ping_avg,
    };

    statsData.push(formattedRow);
    // Access each row in the result.
  }

  return statsData;
}
