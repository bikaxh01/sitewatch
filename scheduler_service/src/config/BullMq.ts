import { config } from "dotenv";
import { Queue } from "bullmq";
import { logger } from "./logger";
config();

const monitoringService = new Queue("Monitoring", {
  connection: {
    host: process.env.MQ_HOST,
    port: 6379,
  },
});

async function pushToBullMQ(data: string) {
  await monitoringService.add("MonitoringUrl", data);
  logger.info("Pushed");
}

export { pushToBullMQ };
