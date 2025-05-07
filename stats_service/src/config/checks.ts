import { exec } from "child_process";
import { StatsData } from "./db";
import { config } from "dotenv";
config();
export interface StatsResponse {
  name_lookup: number;
  tcp_connection: number;
  tls_handshake: number;
  start_transfer: number;
  total_time: number;
}

export async function getStats(url: string): Promise<StatsResponse> {
  if (process.env.ENV === "PROD") {
    console.log(`checking ping for ${url} in PROD`);

    return new Promise((resolve, reject) => {
      exec(
        `curl -s -w '{"name_lookup": "%{time_namelookup}", "tcp_connection": "%{time_connect}", "tls_handshake": "%{time_appconnect}", "start_transfer": "%{time_starttransfer}", "total_time": "%{time_total}"}' -o /dev/null ${url} | jq .`,
        (error, stdOut, stdErr) => {
          if (error) {
            console.log("🚀 ~ exec ~ error:", error);

            const response: StatsResponse = {
              name_lookup: 0.0,
              start_transfer: 0.0,
              tcp_connection: 0.0,
              tls_handshake: 0.0,
              total_time: 0.0,
            };
            resolve(response);
          } else if (stdErr) {
            console.log("🚀 ~ exec ~ stdErr:", stdErr);
            const response: StatsResponse = {
              name_lookup: 0.0,
              start_transfer: 0.0,
              tcp_connection: 0.0,
              tls_handshake: 0.0,
              total_time: 0.0,
            };
            resolve(response);
          } else {
            const parsedResponse = JSON.parse(stdOut);
            console.log("🚀 ~ returnnewPromise ~ parsedResponse:", parsedResponse)
            // parse response extract stats conver to milisecond
            const finalResponse: StatsResponse = {
              name_lookup: secondToMillisecond(parsedResponse.name_lookup),
              start_transfer: secondToMillisecond(
                parsedResponse.start_transfer
              ),
              tcp_connection: secondToMillisecond(
                parsedResponse.tcp_connection
              ),
              tls_handshake: secondToMillisecond(parsedResponse.tls_handshake),
              total_time: secondToMillisecond(parsedResponse.total_time),
            };

            resolve(finalResponse);
          }
        }
      );
    });
  } else {
    // while running in local
    console.log(`checking ping for ${url} in Dev`);
    return {
      name_lookup: 0.148957,
      tcp_connection: 0.150128,
      tls_handshake: 0.0,
      start_transfer: 0.152197,
      total_time: 0.152233,
    };
  }
}

function secondToMillisecond(second: string) {
  return Number(second) * 1000;
}
