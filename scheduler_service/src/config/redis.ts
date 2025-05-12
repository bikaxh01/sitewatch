import axios from "axios";
import { log } from "console";
import { config } from "dotenv";

import { createClient } from "redis";
import { logger } from "./logger";
config();

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (error) => {
  logger.error("ERROR WHILE CONNECTING TO REDIS 🔴🔴");
});

(async () => {
  redisClient.connect();
})();

const getMonitoringUrls = async () => {
  const urls = await redisClient.zRange("monitoring:urls", 0, Date.now(), {
    BY: "SCORE",
  });

  logger.info("🚀 ~ getMonitoringUrls ~ urls:", urls);

  //   if (urls.length > 0) {

  return urls;
  //   } else {
  //     // make api call
  //     console.log("Switched to Fallback🔴");

  //     const res = await axios.get(
  //       `${process.env.URL_SERVICE_URL}/internal/get-urls`
  //     );

  //     const urls = res.data.data.map((url: any) => {
  //       return JSON.stringify(url);
  //     });

  //     return urls;
  //   }
};

const syncRedisToDb = async () => {
  console.log("Syncing Redis with db🟢");

  try {
    const res = await axios.get(
      `${process.env.URL_SERVICE_URL}/internal/get-urls`
    );
    const urls = await res.data.data;

    for (const url of urls) {
      const nextCheckTime = Date.now();

      const exists = await redisClient.zScore(
        "monitoring:urls",
        JSON.stringify(url)
      );

      if (!exists) {
        await redisClient.zAdd("monitoring:urls", [
          {
            value: JSON.stringify(url),
            score: nextCheckTime,
          },
        ]);
      }
    }

    console.log("Sync completed");
  } catch (error) {
    console.log("🚀 ~ syncRedisToDb ~ error:", error);
  }
};

export { redisClient, getMonitoringUrls, syncRedisToDb };
