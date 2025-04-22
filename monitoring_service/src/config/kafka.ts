import { config } from "dotenv";
import { Kafka } from "kafkajs";
config();

const kafkaClient = new Kafka({
  clientId: "schedule:01",
  brokers: [process.env.KAFKA_URL as string],
});

async function consumeFromKafka() {
  const consumer = await kafkaClient.consumer({ groupId: "monitor-group" ,});
  await consumer.connect();
  await consumer.subscribe({ topic: 'monitor', fromBeginning: true })
  let messages: { data: any }[] = [];
  
  await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;
      
      const data: string = await message.value.toString();
      console.log("🚀 ~ eachMessage: ~ value:", data)
      

       messages.push({ data: data });
    },
});

  return messages
}

export { consumeFromKafka };
