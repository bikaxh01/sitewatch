import { config } from "dotenv";
import { Kafka } from "kafkajs";
config();

const kafkaClient = new Kafka({
  clientId: "schedule:01",
  brokers: [process.env.KAFKA_URL as string],
});

async function pushToKafka(data:string) {
  
  const producer = await kafkaClient.producer();
  await producer.connect();

  await producer.send({
    topic: "monitor", 
    messages: [{ value: data }],
  });

  await producer.disconnect();
}

export {pushToKafka}
