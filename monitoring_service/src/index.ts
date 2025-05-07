import { config } from "dotenv";

import axios from "axios";

import { checkUrl, NetworkCheckResponse } from "./config/utils";

import { redisClient } from "./config/redis";
import { sendNotification } from "./config/notification";

import { Worker } from "bullmq";

config();

//async function main() {
const worker = new Worker(
  "Monitoring",
  async (job) => {
    const { data } = job;
    const urlData = JSON.parse(data);
    console.log("🚀 ~ urlData:", urlData);

    try {
      console.log("Checking for URL ", urlData);

      const finalStatus: NetworkCheckResponse = await checkUrl(
        urlData.domain,
        urlData.url
      );

      const currentStatus = finalStatus.status !== "unknown" ? "UP" : "DOWN";

      if (urlData.status !== currentStatus) {
        try {
          const res = await axios.patch(
            `${process.env.URL_SERVICE_URL}/url/internal/update-status?urlId=${urlData.id}&status=${currentStatus}`
          );

          console.log(
            `Updating url status ${urlData.id} to ${currentStatus} 🟢`
          );
        } catch (error) {
          console.log("🚀 ~ main ~ error:", error);
          console.log(
            `failed to updating url status ${urlData.id} to ${currentStatus} 🔴`
          );
        }

        if (
          (urlData.status == "UP" && currentStatus == "DOWN") ||
          (urlData.status == "PENDING" && currentStatus == "DOWN")
        ) {
          //send alert
          //send alert
          console.log("Alert your site is Down");
          await sendNotification(currentStatus, urlData.domain, urlData.id);
          // create incident
          try {
            const res = await axios.post(
              `${process.env.URL_SERVICE_URL}/url/internal/create-incident`,
              { urlId: urlData.id, startTime: new Date() }
            );
            console.log(`Created Incident for ${res.data.data.id} 🟢`);
          } catch (error) {
            console.log(` Error while Created Incident   🔴`);
          }
        } else if (urlData.status == "DOWN" && currentStatus == "UP") {
          // send alert
          await sendNotification(currentStatus, urlData.domain, urlData.id);
          // update incident
          try {
            const res = await axios.post(
              `${process.env.URL_SERVICE_URL}/url/internal/update-incident`,
              { urlId: urlData.id, endTime: new Date() }
            );
            console.log(`updating Incident for ${urlData.id} 🟢`);
          } catch (error) {
            console.log(` Error while updating Incident   🔴`);
          }
          console.log("Alert your site is UP now");
        }
      }

      // Increase nextCheck time
      const nextCheckTime = Date.now() + urlData.checkInterval * 60 * 1000;

      // add to redis
      await redisClient.zAdd("monitoring:urls", [
        {
          value: JSON.stringify({ ...urlData, status: currentStatus }),
          score: nextCheckTime,
        },
      ]);

      // publish to stats
    } catch (error) {
      console.log("🚀 ~ main ~ error:", error);
    }
  },
  {
    connection: {
      host: process.env.MQ_HOST,
      port: 6379,
    },
  }
);

worker.on("error", (err) => {
  console.error("Worker error:", err);
});
