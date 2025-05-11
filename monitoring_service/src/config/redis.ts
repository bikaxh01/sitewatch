import { config } from "dotenv";
import { createClient } from "redis";

config();

const redisClient = createClient({ url: process.env.REDIS_URL });


redisClient.on("error", (error) => {
 
  console.log("ERROR WHILE CONNECTING REDIS 🔴🔴");
});

(async () => {
  redisClient.connect();
  console.log("Redis connected 🟢🟢 ");
  
})();

export { redisClient };
