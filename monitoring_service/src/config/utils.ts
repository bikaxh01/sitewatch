import axios from "axios";


export type NetworkCheckResponse = {
  status: string;
};

export async function checkUrl(domain: any, url: string) {
  let finalData: NetworkCheckResponse = {
    status: "unknown",
  };
  
  try {
    const httpRes = await axios.get(url);

    finalData["status"] = httpRes.status.toString();
  } catch (error: any) {
   
    finalData.status = "unknown";
  }

  return finalData;
}
