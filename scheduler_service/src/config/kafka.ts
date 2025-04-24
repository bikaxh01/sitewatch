import { config } from "dotenv";
import { Kafka } from "kafkajs";
import { redisClient } from "./redis";
config();

const kafkaClient = new Kafka({
  clientId: "schedule:01",
  brokers: [process.env.KAFKA_URL as string],
});

async function pushToRedisQueue(data:string) {
  

  await redisClient.lPush("monitoring",data)
  // const producer = await kafkaClient.producer();
  // await producer.connect();

  // await producer.send({
  //   topic: "monitor", 
  //   messages: [{ value: data }],
  // });

  // await producer.disconnect();
}


async function getFromQueue() {
  const data:any = await redisClient.rPop("monitoring")
  console.log("🚀 ~ getFromQueue ~ data:", data)
  return JSON.parse(data)
}

export {pushToRedisQueue,getFromQueue}
