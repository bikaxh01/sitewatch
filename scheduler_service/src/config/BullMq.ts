import { config } from "dotenv";
import { Queue } from "bullmq";

// Uncomment and configure your Redis client if necessary
// import { redisClient } from "./redis";

config();

// Initialize the queue
const monitoringService = new Queue("Monitoring");

async function pushToBullMQ(data: string) {
  // Add job with the name of the queue already defined
  await monitoringService.add("MonitoringUrl", data);
  console.log("Pushed");
  
}




export { pushToBullMQ };
