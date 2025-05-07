import { config } from "dotenv";
import { getStats } from "./config/checks";
import { addToDb, StatsData } from "./config/db";
config();

const currentRegion = process.env.Region;


// subscribe topic 
// get data
// parse data


async function main() {
  const urlId = "123123123";
  const url = "https://www.example.com";
  const statsResult = await getStats(url);

  if (!currentRegion) {
    console.log("Invalid region 🔴");
    process.exit(0);
    return
  }

  const finalData: StatsData = {
    dataTransfer: statsResult.start_transfer,
    nameLookup: statsResult.name_lookup,
    region: currentRegion,
    tcpConnection: statsResult.tcp_connection,
    tlsHandshake: statsResult.tls_handshake,
    totalTime: statsResult.total_time,
    url: url,
    urlId: urlId,
  };

 await addToDb(finalData);
}

main();
