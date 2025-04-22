import cron from "node-cron";
import { getFromQueue, pushToRedisQueue } from "./config/kafka";
import { getMonitoringUrls, redisClient, syncRedisToDb } from "./config/redis";

async function main() {
  //get urls

  // const monitoringUrls = await getMonitoringUrls();

  // if (monitoringUrls.length <= 0) {
  //   console.log("Retuning back");

  //   return null;
  // }

  // // send each to kafka
  // for (const url of monitoringUrls) {
  //   //@ts-ignore
  //   console.log(`🚀 ~ pushing  ${url.id} at ${new Date()}`);
  //   pushToKafka(url);

  //   await redisClient.zRem("monitoring:urls", url);
  // }

  const url = { url: "bikash.com" };
  pushToRedisQueue(JSON.stringify(url));

  const data = await getFromQueue();
  console.log("🚀 ~ main ~ data:", data.url);

  console.log("Pushed all messages");
}

//cron.schedule("*/30 * * * * *", () => {
main();
// });

// cron.schedule("*/5 * * * *", () => {
//   console.log("Executing Sync ");
//   console.log("DB syncing");

//   syncRedisToDb();
// });
