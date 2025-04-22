import { config } from "dotenv";
import { Kafka } from "kafkajs";

import axios from "axios";
import ping from "ping";
import { checkUrl, NetworkCheckResponse } from "./config/utils";
import { addToDb, MonitorData } from "./config/influx";
import { redisClient } from "./config/redis";
import { sendNotification } from "./config/notification";

config();

const kafkaClient = new Kafka({
  clientId: "schedule:01",
  brokers: [process.env.KAFKA_URL as string],
});


async function main() {
    const consumer = await kafkaClient.consumer({ groupId: "monitor-group" });
    await consumer.connect();
    await consumer.subscribe({ topic: "monitor", fromBeginning: true });

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        const data: string = await message.value.toString();
        const urlData = JSON.parse(data);
        console.log(`🚀 ~ checking for: ${urlData.id} at ${new Date()}`)
       

        try {
            const finalStatus: NetworkCheckResponse = await checkUrl(
              urlData.domain,
              urlData.url
            );
        
            const currentStatus = finalStatus.status !== "unknown" ? "UP" : "DOWN";
        
            if (urlData.status !== currentStatus) {
              //
              try {
                const res = await axios.patch(
                  `${process.env.URL_SERVICE_URL}/url/internal/update-status?urlId=${urlData.id}&status=${currentStatus}`
                );
        
                console.log(`Updating url status ${urlData.id} to ${currentStatus} 🟢`);
              } catch (error) {
                console.log("🚀 ~ main ~ error:", error);
                console.log(
                  `failed to updating url status ${urlData.id} to ${currentStatus} 🔴`
                );
              }
        
              if ((urlData.status == "UP" && currentStatus == "DOWN") || (urlData.status == "PENDING" && currentStatus == "DOWN") ) {
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
        
            // save to db
            const dbData: MonitorData = {
              http_status: finalStatus.status,
              ping_avg: finalStatus.pingRes.avg,
              ping_max: finalStatus.pingRes.max,
              ping_min: finalStatus.pingRes.min,
              url: urlData.url,
              urlId: urlData.id,
            };
            await addToDb(dbData);
          } catch (error) {
            console.log("🚀 ~ main ~ error:", error);
          }
      },
    });


}

main();

// const urlData = {
//     id: "c9333849-be0c-4052-89e9-220f2bce3b5c",
//     url: "https://bikash.cloud/",
//     domain: "google.bikash.cloud",
//     checkInterval: 3,
//     status: "DOWN",
//     monitorName: null,
//   };
