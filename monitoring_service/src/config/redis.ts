import { config } from "dotenv";
import { createClient } from "redis";
import { logger } from "./logs";

config();

const redisClient = createClient({ url: process.env.REDIS_URL });


redisClient.on("error", (error) => {
 
  logger.error("ERROR WHILE CONNECTING REDIS 🔴🔴");
});

(async () => {
  redisClient.connect();
  logger.info("Redis connected 🟢🟢 ");
  
})();

export { redisClient };
