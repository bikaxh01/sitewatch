import cron from "node-cron";
import { pushToBullMQ } from "./config/BullMq";
import { getMonitoringUrls, redisClient, syncRedisToDb } from "./config/redis";

async function main() {
  //get urls

  const monitoringUrls = await getMonitoringUrls();

  if (monitoringUrls.length <= 0) {
    console.log("Retuning back");

    return null;
  }

  // send each to kafka
  for (const url of monitoringUrls) {
    
 
    pushToBullMQ(url);

    await redisClient.zRem("monitoring:urls", url);
  }

  console.log("Pushed all messages");
}

cron.schedule("*/30 * * * * *", () => {
  console.log("Executing main ");

  main();
});

// cron.schedule("*/5 * * * *", () => {
//   console.log("Executing Sync ");
//   console.log("DB syncing");

//   syncRedisToDb();
// });
