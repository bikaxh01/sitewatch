import { config } from "dotenv";
import { createClient } from "redis";
import { logger } from "./log";

config();

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (error) => {
  logger.error("🚀 ~ redisClient.on ~ error:", error);
});

(async () => {
  try {
    redisClient.connect();
  } catch (error) {
    logger.error("🚀 ~ error:", error);
  }
})();

export { redisClient };
