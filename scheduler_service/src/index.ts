import cron from "node-cron";
import { pushToBullMQ } from "./config/BullMq";
import { getMonitoringUrls, redisClient, syncRedisToDb } from "./config/redis";
import { logger } from "./config/logger";

async function main() {
  const monitoringUrls = await getMonitoringUrls();

  if (monitoringUrls.length <= 0) {
    logger.info("No url founds");

    return null;
  }

  // send each to kafka because we have to do with kafka

  for (const url of monitoringUrls) {
    pushToBullMQ(url);

    await redisClient.zRem("monitoring:urls", url);
  }
}

cron.schedule("*/30 * * * * *", () => {
  main();
});

// cron.schedule("*/5 * * * *", () => {
//   console.log("Executing Sync ");
//   console.log("DB syncing");

//   syncRedisToDb();
// });
