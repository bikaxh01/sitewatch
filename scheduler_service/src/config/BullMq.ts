import { config } from "dotenv";
import { Queue } from "bullmq";
config();

const monitoringService = new Queue("Monitoring", {
  connection: {
    host: process.env.MQ_HOST,
    port: 6379,
  },
});

async function pushToBullMQ(data: string) {
  // Add job with the name of the queue already defined
  await monitoringService.add("MonitoringUrl", data);
  console.log("Pushed");
}

export { pushToBullMQ };
