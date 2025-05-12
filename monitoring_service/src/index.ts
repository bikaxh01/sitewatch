import { config } from "dotenv";

import axios from "axios";

import { checkUrl, NetworkCheckResponse } from "./config/utils";

import { redisClient } from "./config/redis";
import { sendNotification } from "./config/notification";

import { Worker } from "bullmq";
import { pushToStats } from "./config/statsConfig";
import { takeScreenShort } from "./config/puppeteer";
import { uploadImage } from "./config/cloudinary";
import { logger } from "./config/logs";
import { url } from "inspector";

config();

const worker = new Worker(
  "Monitoring",
  async (job) => {
    const { data } = job;
    const urlData = JSON.parse(data);
    logger.info("URL DATA RECEIVED:", urlData);

    try {
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
        } catch (error) {
          logger.error(
            `failed to updating url status ${urlData.id} to ${currentStatus} 🔴`
          );
        }

        if (
          (urlData.status == "UP" && currentStatus == "DOWN") ||
          (urlData.status == "PENDING" && currentStatus == "DOWN")
        ) {
          //send alert
          //send alert

          await sendNotification(currentStatus, urlData.domain, urlData.id);
          // create incident
          try {

            logger.warn(`CRATING INCIDENT FOR ${urlData.id} `)
            const path = await takeScreenShort(urlData.url, urlData.id);
            const imageUrl = await uploadImage(path);
            console.log("🚀 ~ imageUrl:", imageUrl)

            const res = await axios.post(
              `${process.env.URL_SERVICE_URL}/url/internal/create-incident`,
              { urlId: urlData.id, startTime: new Date(), imageUrl }
            );
          } catch (error) {
            logger.error(` Error while Created Incident   🔴`);
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
          } catch (error) {
            logger.error(` Error while updating Incident   🔴`);
          }
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

      await pushToStats({ urlId: urlData.id, url: urlData.url });
    } catch (error) {
      logger.error("🚀 ~ main ~ error:", error);
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
  logger.error("Worker error:", err);
});
