import axios from "axios";


export type NetworkCheckResponse = {
  status: string;
};

export async function checkUrl(domain: any, url: string) {
  let finalData: NetworkCheckResponse = {
    status: "unknown",
  };
  console.log(`Chekcing for ${domain} url: ${url} 🟢🟢`);
  try {
    const httpRes = await axios.get(url);

    finalData["status"] = httpRes.status.toString();
  } catch (error: any) {
    console.log("🚀 ~ checkUrl ~ error:", error);
    finalData.status = "unknown";
  }

  return finalData;
}
