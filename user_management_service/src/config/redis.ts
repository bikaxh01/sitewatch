import { config } from "dotenv";
import { createClient } from "redis";

config();

const redisClient = createClient({ url: process.env.REDIS_URL });

redisClient.on("error", (error) => {
  console.log("🚀 ~ redisClient.on ~ error:", error)
  console.log("ERROR WHILE CONNECTING REDIS 🔴🔴");
});


(async () => {
 try {
  console.log("Connecting with redis 🟢🟢");
  
   redisClient.connect();
 } catch (error) {
  console.log("🚀 ~ error:", error)
  
 }
})();

export { redisClient };
