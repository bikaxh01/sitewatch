import axios from "axios";
import { exec } from "child_process";


export type NetworkCheckResponse = {
  status: string;
  pingRes: PingRes;
};

type PingRes = {
  alive?: boolean;
  avg: number;
  max: number;
  min: number;
};

export async function checkUrl(domain: any, url: string) {
  let finalData: NetworkCheckResponse = {
    status: "unknown",
    pingRes: {
      alive: false,
      avg: 0,
      max: 0,
      min: 0,
    },
  };

  // http check
  try {
    const httpRes = await axios.get(url);

    finalData["status"] = httpRes.status.toString();
  } catch (error: any) {
    console.log("🚀 ~ checkUrl ~ error:", error);
    finalData.status = "unknown";
  }

  const res: PingRes = await pingCheck(domain);

  finalData.pingRes = res;

  return finalData;
}

async function pingCheck(domain: string): Promise<PingRes> {
  return new Promise((resolve, reject) => {
    exec(`ping ${domain}`, (error, stdOut, stdErr) => {
      if (error) {
        const pingData: PingRes = {
          min: 0,
          avg: 0,
          max: 0,
        };
        resolve({ ...pingData, alive: false });
      } else if (stdErr) {
        const pingData: PingRes = {
          min: 0,
          avg: 0,
          max: 0,
        };
        resolve({ ...pingData, alive: false });
      } else {
        const res: PingRes = pingStatsExtraction(stdOut);

        resolve({ ...res, alive: true });
      }
    });
  });
}

function pingStatsExtraction(rawData: String): PingRes {
  try {
    const env = process.env.ENV;
    if (env == "PROD") {
      const match = rawData.match(
        /rtt min\/avg\/max\/mdev = ([\d.]+)\/([\d.]+)\/([\d.]+)\/([\d.]+) ms/
      );

      if (match) {
        const minTime = parseFloat(match[1]);
        const avgTime = parseFloat(match[2]);
        const maxTime = parseFloat(match[3]);

        const pingData: PingRes = {
          min: minTime,
          avg: avgTime,
          max: maxTime,
        };

        return pingData;
      } else {
        const pingData: PingRes = {
          min: 0,
          avg: 0,
          max: 0,
        };
        return pingData;
      }
    }

    const minMatch = rawData.match(/Minimum = (\d+)ms/);
    const maxMatch = rawData.match(/Maximum = (\d+)ms/);
    const avgMatch = rawData.match(/Average = (\d+)ms/);

    // Convert matches to integers
    const minTime = minMatch ? parseInt(minMatch[1], 10) : 0;
    const maxTime = maxMatch ? parseInt(maxMatch[1], 10) : 0;
    const avgTime = avgMatch ? parseInt(avgMatch[1], 10) : 0;

    const pingData: PingRes = {
      min: minTime,
      avg: avgTime,
      max: maxTime,
    };
    return pingData;
    // Output results
  } catch (error) {
    const pingData: PingRes = {
      min: 0,
      avg: 0,
      max: 0,
    };
    return pingData;
  }
}
