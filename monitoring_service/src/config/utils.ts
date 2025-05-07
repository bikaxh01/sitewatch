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
  console.log(`Chekcing for ${domain} url: ${url} 🟢🟢`);

  // http check
  try {
    const httpRes = await axios.get(url);

    finalData["status"] = httpRes.status.toString();
  } catch (error: any) {
    console.log("🚀 ~ checkUrl ~ error:", error);
    finalData.status = "unknown";
  }

  return finalData;
}

