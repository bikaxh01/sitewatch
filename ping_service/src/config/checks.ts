import { exec } from "child_process";
import { StatsData } from "./db";

export interface StatsResponse {
  name_lookup: number;
  tcp_connection: number;
  tls_handshake: number;
  start_transfer: number;
  total_time: number;
}

export async function getStats(url: string): Promise<StatsResponse> {
  console.log(`checking ping for ${url}`);

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
            console.log(`ping chekc ${stdOut} 🟢🟢`);

            const parsedResponse: StatsResponse = JSON.parse(stdOut);
            // parse response extract stats conver to milisecond

            resolve(parsedResponse);
          }
        }
      );
    });
  } else {
    // while running in local
    return {
      name_lookup: 0.0,
      start_transfer: 0.0,
      tcp_connection: 0.0,
      tls_handshake: 0.0,
      total_time: 0.0,
    };
  }
}

// curl -s -w '{"name_lookup": "%{time_namelookup}", "tcp_connection": "%{time_connect}", "tls_handshake": "%{time_appconnect}", "start_transfer": "%{time_starttransfer}", "total_time": "%{time_total}"}' -o /dev/null https://example.com | jq .
